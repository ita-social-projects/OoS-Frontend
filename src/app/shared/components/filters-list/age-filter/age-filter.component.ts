import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetAgeRange } from 'src/app/shared/store/filter.actions';
import { MatCheckbox } from '@angular/material/checkbox';
import { AgeRange } from 'src/app/shared/models/ageRange.model';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit {
  ageValues: AgeRange[] = [
    {
      minAge: 0,
      maxAge: 5
    },
    {
      minAge: 6,
      maxAge: 10
    },
    {
      minAge: 11,
      maxAge: 14
    },
    {
      minAge: 15,
      maxAge: 16
    }
  ];
  selectedAgeRange: AgeRange[] = [];

  constructor(private store: Store) { }

  ngOnInit(): void { }

  /**
  * This method check selected age range and distpatch filter action
  * @param ageRange
  * @param event
  */
  onAgeRangeCheck(ageRange: AgeRange, event: MatCheckbox): void {
    (event.checked) ? this.selectedAgeRange.push(ageRange) : this.selectedAgeRange.splice(this.selectedAgeRange.indexOf(ageRange), 1);
    this.store.dispatch(new SetAgeRange(this.selectedAgeRange));
  }
}
