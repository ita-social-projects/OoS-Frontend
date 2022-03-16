import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { AdminTabs, AdminTabsUkr } from 'src/app/shared/enum/enumUA/admin-tabs';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Direction, DirectionsFilter } from 'src/app/shared/models/category.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { CabinetPageChange, DeleteDirectionById, GetFilteredDirections, GetInfoAboutPortal, SetSearchQueryValue } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetDirections } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';


@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit, OnDestroy {

  readonly adminTabs = AdminTabs;
  readonly adminTabsUkr = AdminTabsUkr;

  searchValue = new FormControl('', [Validators.maxLength(200)]);
  isResultPage = false;
  Name: string;

  @Select(AdminState.filteredDirections)
  filteredDirections$: Observable<DirectionsFilter>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Select(AdminState.searchQuery)
  searchQuery$: Observable<string>;
  


  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };

  tabIndex: number;
  



  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog) { }
    

  ngOnInit(): void {
    this.store.dispatch(new GetFilteredDirections());
    this.store.dispatch(new GetInfoAboutPortal());
    this.route.params.pipe(
      takeUntil(this.destroy$))
      .subscribe((params: Params) => this.tabIndex = +this.adminTabs[params.index]);

      this.searchValue.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: string) => {
        this.Name = val;
        if (val.length === 0) {
          this.store.dispatch(new SetSearchQueryValue(''));
        }
      });

    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text: string) => this.searchValue.setValue(text, {emitEvent: false}));
  }

  onSelectedTabChange(event: MatTabChangeEvent): void {
    this.router.navigate([`admin-tools/platform/${this.adminTabs[event.index]}`]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new CabinetPageChange(page));
  }

  onDelete(direction: Direction): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: {
        type: ModalConfirmationType.deleteDirection,
        property: direction.title
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteDirectionById(direction.id));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  onSearch(): void {
    this.store.dispatch(new SetSearchQueryValue(this.Name || ''));
  }
}
