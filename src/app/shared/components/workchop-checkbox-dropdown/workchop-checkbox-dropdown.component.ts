import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from '../../models/workshop.model';
import { GetWorkshops } from '../../store/app.actions';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-workchop-checkbox-dropdown',
  templateUrl: './workchop-checkbox-dropdown.component.html',
  styleUrls: ['./workchop-checkbox-dropdown.component.scss']
})
export class WorkchopCheckboxDropdownComponent implements OnInit {

  workshopControl = new FormControl();
  allWorkshops = 'Усі гуртки';
  @Input() workshops: Workshop[];
  @Output() workshopCheck = new EventEmitter<Workshop[]>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.workshopControl.valueChanges.subscribe(workshop => this.workshopCheck.emit(workshop));
  }

}
