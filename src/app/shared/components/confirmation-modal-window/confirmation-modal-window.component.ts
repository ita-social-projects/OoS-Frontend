import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import {
  ModalConfirmationText,
  ModalConfirmationTitle,
  ModalConfirmationType,
  ModalConfirmationTypeWithQuotes
} from 'shared/enum/modal-confirmation';

@Component({
  selector: 'app-confirmation-modal-window',
  templateUrl: './confirmation-modal-window.component.html',
  styleUrls: ['./confirmation-modal-window.component.scss']
})
export class ConfirmationModalWindowComponent implements OnInit {
  public readonly modalConfirmationType = ModalConfirmationType;
  public readonly modalWindow = true;

  public modalTitle: string;
  public modalConfirmationText: string;
  public modalConfirmationProperty: string;
  public ratingSelectControl: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: string;
      property: string;
    }
  ) {}

  public ngOnInit(): void {
    this.modalTitle = ModalConfirmationTitle[this.data.type];
    this.modalConfirmationText = ModalConfirmationText[this.data.type];
    if (this.data.property) {
      this.modalConfirmationProperty = this.data.property.trim();
      if (this.data.type in ModalConfirmationTypeWithQuotes) {
        this.modalConfirmationProperty = `"${this.modalConfirmationProperty}"`;
      }
    }
  }
}
