import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalConfirmationText, ModalConfirmationTitle, ModalConfirmationType } from '../../enum/modal-confirmation';

@Component({
  selector: 'app-confirmation-modal-window',
  templateUrl: './confirmation-modal-window.component.html',
  styleUrls: ['./confirmation-modal-window.component.scss']
})
export class ConfirmationModalWindowComponent implements OnInit {
  readonly modalConfirmationType = ModalConfirmationType;
  readonly modalWindow = true;
  
  modalTitle: string;
  modalConfirmationText: string;
  modalConfirmationProperty: string;
  ratingSelectControl: UntypedFormControl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    type: string,
    property: string
  }) { }

  ngOnInit(): void {
    this.modalTitle = ModalConfirmationTitle[this.data.type];
    this.modalConfirmationText = ModalConfirmationText[this.data.type];
    if (this.data.property) {
      this.modalConfirmationProperty = this.data.property;
    }
  }

}
