import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetAgeRange } from 'src/app/shared/store/filter.actions';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit {
  ageValues: string[] = ["0-5", "6-10", "11-14", "15-16"];
  selectedAgeRange: string[] = [];

  constructor(private store: Store) { }

  ngOnInit(): void { }

  /**
  * This method check selected age range and distpatch filter action
  * @param ageRange
  * @param event
  */
  onAgeRangeCheck(ageRange: string, event: MatCheckbox): void {
    (event.checked) ? this.selectedAgeRange.push(ageRange) : this.selectedAgeRange.splice(this.selectedAgeRange.indexOf(ageRange), 1);
    this.store.dispatch(new SetAgeRange(this.selectedAgeRange));
  }
}
