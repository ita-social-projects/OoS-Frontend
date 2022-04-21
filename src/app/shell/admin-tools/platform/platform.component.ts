import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminTabs, AdminTabsUkr } from 'src/app/shared/enum/enumUA/admin-tabs';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Direction, DirectionsFilter } from 'src/app/shared/models/category.model';
import { AboutPortal } from 'src/app/shared/models/aboutPortal.model';
import { GetFilteredDirections, GetInfoAboutPortal } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';


@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit, OnDestroy {

  readonly adminTabs = AdminTabs;
  readonly adminTabsUkr = AdminTabsUkr;

  @Select(AdminState.aboutPortal)
  aboutPortal$: Observable<AboutPortal>;
  @Select(AdminState.filteredDirections)
  filteredDirections$: Observable<DirectionsFilter>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() direction: Direction;
  tabIndex: number;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new GetInfoAboutPortal());
    this.route.params.pipe(
      takeUntil(this.destroy$))
      .subscribe((params: Params) => this.tabIndex = +this.adminTabs[params.index]);

  }
  onSelectedTabChange(event: MatTabChangeEvent): void {
    this.router.navigate([`admin-tools/platform/${this.adminTabs[event.index]}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
