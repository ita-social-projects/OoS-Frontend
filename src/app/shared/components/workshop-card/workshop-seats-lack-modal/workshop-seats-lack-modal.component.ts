import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-workshop-seats-lack-modal',
  templateUrl: './workshop-seats-lack-modal.component.html',
  styleUrls: ['./workshop-seats-lack-modal.component.scss']
})
export class WorkshopSeatsLackModalComponent implements OnInit {
  workshopId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      workshopId: string;
      workshopTitle: string;
    }
  ) {}

  ngOnInit(): void {
    this.workshopId = this.data.workshopId;
  }
}
