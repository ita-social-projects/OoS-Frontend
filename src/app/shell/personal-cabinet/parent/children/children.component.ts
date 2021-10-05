import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Child } from 'src/app/shared/models/child.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { PageChange } from 'src/app/shared/store/filter.actions';
import { DeleteChildById } from 'src/app/shared/store/user.actions';
import { CabinetDataComponent } from '../../cabinet-data/cabinet-data.component';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss']
})
export class ChildrenComponent extends CabinetDataComponent implements OnInit {

  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };

  constructor(store: Store,
    matDialog: MatDialog) {
    super(store, matDialog);
  }

  ngOnInit(): void {
    this.getUserData();
  }

  init(): void {
    this.getUsersChildren();
  }

  onDelete(child: Child): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: {
        type: ModalConfirmationType.delete,
        property: `${child.firstName} ${child.lastName}`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      (result) && this.store.dispatch(new DeleteChildById(child.id));
    });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new PageChange(page));
  }

}
