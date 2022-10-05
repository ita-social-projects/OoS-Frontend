import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DropdownData, FilterData } from '../../../../../shared/models/history-log.model';

@Component({
  selector: 'app-history-log-filters',
  templateUrl: './history-log-filters.component.html',
  styleUrls: ['./history-log-filters.component.scss'],
})
export class HistoryLogFiltersComponent implements OnInit {
  @Input() dropdownOptions: DropdownData;
  @Output() filterData = new EventEmitter<FilterData>();

  filtersForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      dateFrom: new FormControl(''),
      dateTo: new FormControl(''),
      options: new FormControl(''),
    });
  }

  applyFilters(): void {
    this.filterData.emit(this.filtersForm.value);
  }
}
