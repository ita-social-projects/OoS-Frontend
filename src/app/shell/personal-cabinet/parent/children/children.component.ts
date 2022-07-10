import { NavigationBarService } from './../../../../shared/services/navigation-bar/navigation-bar.service';
import { Application } from 'src/app/shared/models/application.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Select, Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Child } from 'src/app/shared/models/child.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { DeleteChildById, GetUsersChildren } from 'src/app/shared/store/user.actions';
import { CabinetDataComponent } from '../../cabinet-data/cabinet-data.component';
import { Observable, Subject } from 'rxjs';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { OnPageChangeChildrens, SetChildrensPerPage, SetFirstPage } from 'src/app/shared/store/paginator.actions';
import { Constants } from 'src/app/shared/constants/constants';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss']
})
export class ChildrenComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  @Select(PaginatorState.childrensPerPage)
  childrensPerPage$: Observable<number>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };
  applicationParams: {
    status: string,
    showBlocked: boolean,
    workshopsId: string[],
  };

  constructor(
    navigationBarService: NavigationBarService,
    store: Store,
    matDialog: MatDialog,
    actions$: Actions) {
    super(store, matDialog, actions$, navigationBarService);
  }

  ngOnInit(): void {
    this.getUserData();
    this.store.dispatch(
      new PushNavPath(
        {
          name: NavBarName.Children,
          isActive: false,
          disable: true,
        }
      )
    );    
  }

  init(): void {
    this.getUsersChildren();
    this.getParentApplications(this.applicationParams);

  }

  childApplications(applications: Application[], child: Child): Array<Application> {
    return applications?.length && applications.filter((application: Application) => application.child.id === child.id && application.status === 'Approved');
  }

  onDelete(child: Child): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
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
    this.store.dispatch([new SetChildrensPerPage(itemsPerPage), new GetUsersChildren()]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeChildrens(page), new GetUsersChildren()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch([new SetFirstPage(), new PopNavPath()]);
  }
}
