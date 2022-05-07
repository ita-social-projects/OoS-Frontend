import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WorkshopDeclination } from '../../enum/enumUA/declination';
import { Child } from '../../models/child.model';
import { Workshop, WorkshopCard } from '../../models/workshop.model';

@Component({
  selector: 'app-workshop-checkbox-dropdown',
  templateUrl: './workshop-checkbox-dropdown.component.html',
  styleUrls: ['./workshop-checkbox-dropdown.component.scss']
})
export class WorkshopCheckboxDropdownComponent implements OnInit, OnDestroy {

  entityControl = new FormControl();
  ids: string[];
  dropdownEntities = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() entities: WorkshopCard[] | Child[];
  @Input() dropdownContainerClass: string;
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

  getFullName(firstName: string, lastName: string): string {return `${firstName} ${lastName}`};

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
