import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Workshop } from '../../models/workshop.model';
@Component({
  selector: 'app-workshop-checkbox-dropdown',
  templateUrl: './workshop-checkbox-dropdown.component.html',
  styleUrls: ['./workshop-checkbox-dropdown.component.scss']
})
export class WorkshopCheckboxDropdownComponent implements OnInit, OnDestroy {

  workshopControl = new FormControl();
  workshopsId: number[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() workshops: Workshop[];
  @Output() workshopCheck = new EventEmitter<number[]>();

  constructor() { }

  ngOnInit(): void {
    this.workshopControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe((workshops: Workshop[]) => {
        this.workshopsId = workshops.map((workshop: Workshop) => workshop.id);
        this.workshopCheck.emit(this.workshopsId);
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
