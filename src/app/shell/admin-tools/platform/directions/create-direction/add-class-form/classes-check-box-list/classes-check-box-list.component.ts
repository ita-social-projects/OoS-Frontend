import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { IClass } from 'src/app/shared/models/category.model';
import { DeleteClassById } from 'src/app/shared/store/admin.actions';

@Component({
  selector: 'app-classes-check-box-list',
  templateUrl: './classes-check-box-list.component.html',
  styleUrls: ['./classes-check-box-list.component.scss']
})
export class ClassesCheckBoxListComponent {
  @Input() classes: IClass[];

  selectedIClasses: IClass[] = [];

  constructor (
    private store: Store,
    private matDialog: MatDialog
  ) { }

  onDelete(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteIClass,
      }
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if(result){
          this.selectedIClasses.forEach((iClass: IClass) => this.store.dispatch(new DeleteClassById(iClass)));
        }
      });
      }

  onClassCheck(event: MatCheckbox, iClass: IClass): void {
    (event.checked) ?
      this.selectedIClasses.push(iClass) :
      this.selectedIClasses
        .splice(this.selectedIClasses
        .findIndex((selectedIClasses: IClass) => selectedIClasses.id === iClass.id), 1);
  }
}
