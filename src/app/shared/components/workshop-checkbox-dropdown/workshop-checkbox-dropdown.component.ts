import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Child } from '../../models/child.model';
import { WorkshopCard } from '../../models/workshop.model';

@Component({
  selector: 'app-workshop-checkbox-dropdown',
  templateUrl: './workshop-checkbox-dropdown.component.html',
  styleUrls: ['./workshop-checkbox-dropdown.component.scss']
})
export class WorkshopCheckboxDropdownComponent implements OnInit, OnDestroy {

  entityControl = new FormControl();
  ids: string[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() entities: WorkshopCard[] | Child[];
  @Input() declination;
  @Output() entityCheck = new EventEmitter<string[]>();
  Declination;

  constructor() { }

  ngOnInit(): void {
    this.entityControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe((entities) => {
        this.ids = entities.map((entity) => entity.workshopId || entity.id);
        this.entityCheck.emit(this.ids);
      });
    this.Declination = this.declination;
  }

  getEntityTitle(entity): string {
    return (entity.firstName) ? `${entity.firstName} ${entity.lastName}` : entity.title
  };

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
