import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DropdownData, FilterData } from 'shared/models/history-log.model';

@Component({
  selector: 'app-history-log-filters',
  templateUrl: './history-log-filters.component.html',
  styleUrls: ['./history-log-filters.component.scss']
})
export class HistoryLogFiltersComponent implements OnInit {
  @Input() public dropdownOptions: DropdownData;
  @Output() public filterData = new EventEmitter<FilterData>();

  public filtersForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    const currentDate = new Date();
    const monthAgoDate = new Date(currentDate);
    monthAgoDate.setMonth(currentDate.getMonth() - 1);

    this.filtersForm = this.fb.group({
      dateFrom: new FormControl(monthAgoDate),
      dateTo: new FormControl(currentDate),
      options: new FormControl('')
    });

    this.filterData.emit(this.filtersForm.value);
  }

  public applyFilters(): void {
    this.filterData.emit(this.filtersForm.value);
  }

  public onResetFilters(): void {
    this.filtersForm.reset();
    this.filtersForm.controls.options.setValue('');
  }
}
