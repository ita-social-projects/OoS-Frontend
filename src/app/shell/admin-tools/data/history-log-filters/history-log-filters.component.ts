import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DropdownData, FilterData } from 'src/app/shared/models/history-log.model';

@Component({
  selector: 'app-history-log-filters',
  templateUrl: './history-log-filters.component.html',
  styleUrls: ['./history-log-filters.component.scss'],
})
export class HistoryLogFiltersComponent implements OnInit {
  @Input() dropdownOptions: DropdownData;
  @Output() filterData = new EventEmitter<FilterData>();

  filtersForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit() {
    this.filtersForm = this.fb.group({
      dateFrom: new UntypedFormControl(''),
      dateTo: new UntypedFormControl(''),
      options: new UntypedFormControl(''),
    });
  }

  applyFilters() {
    this.filterData.emit(this.filtersForm.value);
  }
}
