import { Component, Input, OnInit } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-workshop-page',
  templateUrl: './workshop-page.component.html',
  styleUrls: ['./workshop-page.component.scss']
})
export class WorkshopPageComponent implements OnInit {

  @Input() workshop: Workshop;

  constructor() { }

  ngOnInit(): void {
  }
}
