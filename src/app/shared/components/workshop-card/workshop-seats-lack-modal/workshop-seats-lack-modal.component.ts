import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-workshop-seats-lack-modal',
  templateUrl: './workshop-seats-lack-modal.component.html',
  styleUrls: ['./workshop-seats-lack-modal.component.scss']
})
export class WorkshopSeatsLackModalComponent implements OnInit {
  public workshopId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      workshopId: string;
      workshopTitle: string;
    }
  ) {}

  public ngOnInit(): void {
    this.workshopId = this.data.workshopId;
  }
}
