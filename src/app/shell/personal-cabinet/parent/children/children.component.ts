import { Child, ChildCards } from 'src/app/shared/models/child.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Constants, PaginationConstants } from 'src/app/shared/constants/constants';
import { DeleteChildById, GetUsersChildren } from 'src/app/shared/store/user.actions';
import { OnPageChangeChildrens, SetChildrensPerPage, SetFirstPage } from 'src/app/shared/store/paginator.actions';
import { Select, Store } from '@ngxs/store';
import { filter, map, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Observable } from 'rxjs';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { ParentComponent } from '../parent.component';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
})
export class ChildrenComponent extends ParentComponent implements OnInit, OnDestroy {
  @Select(PaginatorState.childrensPerPage)
  childrensPerPage$: Observable<number>;
  @Select(UserState.children)
  childrenCards$: Observable<ChildCards>;
  childrenCards: ChildCards;

  currentPage: PaginationElement = PaginationConstants.firstPage;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Children,
        isActive: false,
        disable: true,
      })
    );
  }

  initParentData(): void {
    this.store.dispatch([new SetFirstPage(),new GetUsersChildren()]);
    this.childrenCards$
      .pipe(
        filter((childrenCards: ChildCards) => !!childrenCards),
        takeUntil(this.destroy$)
      )
      .subscribe((childrenCards: ChildCards) => this.childrenCards = childrenCards);
  }

  onDelete(child: Child): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteChild,
        property: `${child.firstName} ${child.lastName}`,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteChildById(child.id));
    });
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetChildrensPerPage(itemsPerPage), new GetUsersChildren()]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeChildrens(page), new GetUsersChildren()]);
  }
}
