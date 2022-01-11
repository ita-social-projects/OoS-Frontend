import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reject-modal-window',
  templateUrl: './reject-modal-window.component.html',
  styleUrls: ['./reject-modal-window.component.scss']
})
export class RejectModalWindowComponent implements OnInit {
  modalTitle: string;
  modalDescription: string

  constructor() { }

  ngOnInit(): void {
    this.modalTitle = 'Відмінити',
    this.modalDescription = 'тут поле для вводу причини'
  }

}
