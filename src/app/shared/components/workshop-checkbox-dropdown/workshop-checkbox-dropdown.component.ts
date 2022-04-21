import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WorkshopDeclination } from '../../enum/enumUA/declination';
import { WorkshopCard } from '../../models/workshop.model';

@Component({
  selector: 'app-workshop-checkbox-dropdown',
  templateUrl: './workshop-checkbox-dropdown.component.html',
  styleUrls: ['./workshop-checkbox-dropdown.component.scss']
})
export class WorkshopCheckboxDropdownComponent implements OnInit, OnDestroy {

  workshopControl = new FormControl();
  workshopsId: string[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  workshopDeclination = WorkshopDeclination;

  @Input() workshops: WorkshopCard[];
  @Input() dropdownContainerClass: string;
  @Output() workshopCheck = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit(): void {
    this.workshopControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe((workshops: WorkshopCard[]) => {
        this.workshopsId = workshops.map((workshop: WorkshopCard) => workshop.workshopId);
        this.workshopCheck.emit(this.workshopsId);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
