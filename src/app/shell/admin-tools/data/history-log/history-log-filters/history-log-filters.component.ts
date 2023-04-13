import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DropdownData, FilterData } from '../../../../../shared/models/history-log.model';

@Component({
  selector: 'app-history-log-filters',
  templateUrl: './history-log-filters.component.html',
  styleUrls: ['./history-log-filters.component.scss']
})
export class HistoryLogFiltersComponent implements OnInit {
  @Input() dropdownOptions: DropdownData;
  @Output() filterData = new EventEmitter<FilterData>();

  filtersForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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

  applyFilters(): void {
    this.filterData.emit(this.filtersForm.value);
  }

  onResetFilters(): void {
    this.filtersForm.reset();
    this.filtersForm.controls.options.setValue('');
  }
}
