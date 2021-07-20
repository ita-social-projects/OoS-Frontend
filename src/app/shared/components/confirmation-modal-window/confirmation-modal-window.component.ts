import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal-window',
  templateUrl: './confirmation-modal-window.component.html',
  styleUrls: ['./confirmation-modal-window.component.scss']
})
export class ConfirmationModalWindowComponent implements OnInit {

  modalTitle: string;
  modalConfirmationtext: string;


  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
    this.modalTitle = this.data.toUpperCase();
    this.modalConfirmationtext = this.data.toLowerCase();
  }

}
