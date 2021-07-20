import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { modalConfirmationText, modalConfirmationTitle } from '../../enum/modal-confirmation';

@Component({
  selector: 'app-confirmation-modal-window',
  templateUrl: './confirmation-modal-window.component.html',
  styleUrls: ['./confirmation-modal-window.component.scss']
})
export class ConfirmationModalWindowComponent implements OnInit {

  modalTitle: string;
  modalConfirmationText: string;
  modalConfirmationProperty: string;


  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    type: string,
    property: string
  }) { }

  ngOnInit(): void {
    this.modalTitle = modalConfirmationTitle[this.data.type];
    this.modalConfirmationText = modalConfirmationText[this.data.type];
    if (this.data.property) {
      this.modalConfirmationProperty = this.data.property;
    }
  }

}
