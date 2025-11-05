import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  ModalConfirmationButtonText,
  ModalConfirmationText,
  ModalConfirmationTitle,
  ModalConfirmationType,
  ModalConfirmationTypeWithQuotes,
  ModalConfirmationTypeWithThreeOptions
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
  public hasSecondOption: boolean = false;

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
    if (this.data.type in ModalConfirmationTypeWithThreeOptions) {
      this.hasSecondOption = true;
    }
  }

  public getConfirmationButtonMessage(thirdOption: boolean = false): string {
    if (this.data.type === ModalConfirmationType.incompleteWorkshopAndCompetition && thirdOption) {
      return ModalConfirmationButtonText.continueCompetition;
    } else if (this.data.type === ModalConfirmationType.incompleteWorkshopAndCompetition && !thirdOption) {
      return ModalConfirmationButtonText.continueWorkshop;
    } else {
      const buttonText = ModalConfirmationButtonText[this.data.type];
      return buttonText || ModalConfirmationButtonText.default;
    }
  }
}
