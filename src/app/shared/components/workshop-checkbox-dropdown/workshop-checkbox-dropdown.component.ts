import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Workshop } from '../../models/workshop.model';
@Component({
  selector: 'app-workshop-checkbox-dropdown',
  templateUrl: './workshop-checkbox-dropdown.component.html',
  styleUrls: ['./workshop-checkbox-dropdown.component.scss']
})
export class WorkshopCheckboxDropdownComponent implements OnInit {

  workshopControl = new FormControl();
  @Input() workshops: Workshop[];
  @Output() workshopCheck = new EventEmitter<Workshop[]>();

  constructor() { }

  ngOnInit(): void {
    this.workshopControl.valueChanges.subscribe(workshop => this.workshopCheck.emit(workshop));
  }

}
