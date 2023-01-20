import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ParentComponent } from '../parent.component';
import { filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { PaginationConstants, Constants, ModeConstants } from '../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { Child, ChildrenParameters } from '../../../../shared/models/child.model';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { SetFirstPage, SetChildrensPerPage, OnPageChangeChildrens } from '../../../../shared/store/paginator.actions';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { GetUsersChildren, DeleteChildById } from '../../../../shared/store/parent.actions';
import { ParentState } from './../../../../shared/store/parent.state.';
import { SearchResponse } from '../../../../shared/models/search.model';
import { Util } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss']
})
export class ChildrenComponent extends ParentComponent implements OnInit, OnDestroy {
  readonly ModeConstants = ModeConstants;

  @Select(PaginatorState.childrensPerPage)
  childrensPerPage$: Observable<number>;
  @Select(ParentState.children)
  childrenCards$: Observable<SearchResponse<Child[]>>;
  childrenCards: SearchResponse<Child[]>;

  currentPage: PaginationElement = PaginationConstants.firstPage;
  childrenParameters: ChildrenParameters = {
    searchString: '',
    tabTitle: undefined
  };

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Children,
        isActive: false,
        disable: true
      })
    );
  }

  initParentData(): void {
    const childrensPerPage = this.store.selectSnapshot(PaginatorState.childrensPerPage);
    Util.setPaginationParams(this.childrenParameters, this.currentPage, childrensPerPage);

    this.store.dispatch(new GetUsersChildren(this.childrenParameters));
    this.childrenCards$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((childrenCards: SearchResponse<Child[]>) => {
      childrenCards.entities = childrenCards.entities.filter((child: Child) => !child.isParent);
      this.childrenCards = childrenCards;
    });
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
      result && this.store.dispatch(new DeleteChildById(child.id, this.childrenParameters));
    });
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    Util.setPaginationParams(this.childrenParameters, this.currentPage, itemsPerPage);
    this.store.dispatch([new SetChildrensPerPage(itemsPerPage), new GetUsersChildren(this.childrenParameters)]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    Util.setPaginationParams(this.childrenParameters, this.currentPage, this.childrenParameters.size);
    this.store.dispatch([new OnPageChangeChildrens(page), new GetUsersChildren(this.childrenParameters)]);
  }
}
