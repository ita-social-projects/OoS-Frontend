import { ParentState } from './../../../../shared/store/parent.state.';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Child, ChildCards } from 'src/app/shared/models/child.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { Observable } from 'rxjs';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { OnPageChangeChildrens, SetItemsPerPage, SetFirstPage } from 'src/app/shared/store/paginator.actions';
import { Constants, PaginationConstants } from 'src/app/shared/constants/constants';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { ParentComponent } from '../parent.component';
import { filter, takeUntil } from 'rxjs/operators';
import { DeleteChildById, GetUsersChildren } from 'src/app/shared/store/parent.actions';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
})
export class ChildrenComponent extends ParentComponent implements OnInit, OnDestroy {
  @Select(PaginatorState.itemsPerPage)
  itemsPerPage$: Observable<number>;
  @Select(ParentState.children)
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
    this.store.dispatch([new SetFirstPage(), new GetUsersChildren()]);
    this.childrenCards$
      .pipe(
        filter((childrenCards: ChildCards) => !!childrenCards),
        takeUntil(this.destroy$)
      )
      .subscribe((childrenCards: ChildCards) => {
        childrenCards.entities = childrenCards.entities.filter((child: Child) => !child.isParent);
        this.childrenCards = childrenCards;
      });
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
    this.store.dispatch([new SetItemsPerPage(itemsPerPage), new GetUsersChildren()]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeChildrens(page), new GetUsersChildren()]);
  }
}
