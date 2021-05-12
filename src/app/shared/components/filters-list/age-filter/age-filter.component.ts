import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { setMinAge, setMaxAge } from 'src/app/shared/store/filter.actions';

import { FilterStateModel } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit {
  ageValues: string[] = ["0-5", "6-10", "11-14", "15-16"];
  selectedAgeRange: string[] = [];

  constructor() { }

  ngOnInit(): void { }

  onAgeRangeCheck(ageRange, event): void {
    (event) ? this.selectedAgeRange.push(ageRange) : this.selectedAgeRange.splice(this.selectedAgeRange.indexOf(ageRange), 1);
  }
}
