import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-child-activities',
  templateUrl: './child-activities.component.html',
  styleUrls: ['./child-activities.component.scss']
})
export class ChildActivitiesComponent implements OnInit {
  
  @Input() child;

  constructor() { }

  ngOnInit(): void {
  }

}
