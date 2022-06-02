import { Application } from 'src/app/shared/models/application.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Store } from '@ngxs/store';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Child } from 'src/app/shared/models/child.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { DeleteChildById, GetUsersChildren } from 'src/app/shared/store/user.actions';
import { CabinetDataComponent } from '../../cabinet-data/cabinet-data.component';
import { Observable, Subject } from 'rxjs';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { OnPageChangeChildrens, SetChildrensPerPage, SetFirstPage } from 'src/app/shared/store/paginator.actions';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss']
})
export class ChildrenComponent extends CabinetDataComponent implements OnInit, OnDestroy {

  @Select(PaginatorState.childrensPerPage)
  childrensPerPage$: Observable<number>;
  childrensPerPage: number;
  @Select(PaginatorState.currentPage)
  currentPage$: Observable<number>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };

  constructor(
    store: Store,
    matDialog: MatDialog,
    actions$: Actions) {
    super(store, matDialog, actions$);
  }

  ngOnInit(): void {
    this.getUserData();
    this.childrensPerPage$
    .pipe(
      takeUntil(this.destroy$)
      ).subscribe((childrensPerPage: number)=>{
      this.childrensPerPage = childrensPerPage;
      this.store.dispatch(new GetUsersChildren());
      });
  }

  init(): void {
    this.getUsersChildren();
    this.getParentApplications();
    this.actions$.pipe(ofAction(OnPageChangeChildrens))
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(new GetUsersChildren()));
  }

  childApplications(applications: Application[], child: Child): Array<Application> {
    return applications?.length && applications.filter((application: Application) => application.child.id === child.id && application.status === 'Approved');
  }

  onDelete(child: Child): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: {
        type: ModalConfirmationType.deleteChild,
        property: `${child.firstName} ${child.lastName}`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      (result) && this.store.dispatch(new DeleteChildById(child.id));
    });
  }

  onItemsPerPageChange(itemsPerPage: number): void{
    this.store.dispatch(new SetChildrensPerPage(itemsPerPage));
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeChildrens(page));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new SetFirstPage());
  }
}
