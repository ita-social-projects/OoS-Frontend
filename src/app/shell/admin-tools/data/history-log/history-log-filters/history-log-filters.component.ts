import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DropdownData, FilterData } from 'shared/models/history-log.model';
import { FilterOptions, HistoryLogTypes } from 'shared/enum/history.log';
import { ProviderAdminOperationOptions } from 'shared/constants/drop-down';

@Component({
  selector: 'app-history-log-filters',
  templateUrl: './history-log-filters.component.html',
  styleUrls: ['./history-log-filters.component.scss']
})
export class HistoryLogFiltersComponent implements OnInit {
  public filtersForm: FormGroup;
  public formControlName: string = '';
  public additionalFormControlName: string = '';
  public additionalDropdownOptions = ProviderAdminOperationOptions;

  private baseCountOfFiltersFormFields = 2;
  private _tabName: HistoryLogTypes;

  public get tabName(): HistoryLogTypes {
    return this._tabName;
  }

  @Input() public dropdownOptions: DropdownData;
  @Input() public set tabName(newTabName: HistoryLogTypes) {
    this._tabName = newTabName;
    this.setBaseFiltersForm();
    this.additionalFormControlName = '';
    if (Object.keys(this.filtersForm.controls).length > this.baseCountOfFiltersFormFields) {
      this.removeExtraFormControls();
    }
    this.setFiltersDependOnTab(newTabName);
  }

  @Output() public filterData = new EventEmitter<FilterData>();

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.filterData.emit(this.filtersForm.value);
  }

  public applyFilters(): void {
    this.filterData.emit(this.filtersForm.value);
  }

  public onResetFilters(): void {
    this.filtersForm.reset();
    Object.keys(this.filtersForm.controls).forEach((control: string) => {
      this.filtersForm.get(control).setValue('');
    });
  }

  private setFiltersDependOnTab(tabName: HistoryLogTypes): void {
    switch (tabName) {
      case HistoryLogTypes.Providers:
        this.formControlName = FilterOptions.PropertyName;
        this.filtersForm.addControl(FilterOptions.PropertyName, new FormControl(''));
        break;
      case HistoryLogTypes.ProviderAdmins:
        this.formControlName = FilterOptions.AdminType;
        this.filtersForm.addControl(FilterOptions.AdminType, new FormControl(''));
        this.additionalFormControlName = FilterOptions.OperationType;
        this.filtersForm.addControl(FilterOptions.OperationType, new FormControl(''));
        break;
      case HistoryLogTypes.Applications:
        this.formControlName = FilterOptions.PropertyName;
        this.filtersForm.addControl(FilterOptions.PropertyName, new FormControl(''));
        break;
      case HistoryLogTypes.Users:
        this.formControlName = FilterOptions.ShowParents;
        this.filtersForm.addControl(FilterOptions.ShowParents, new FormControl(''));
        break;
    }
  }

  private removeExtraFormControls(): void {
    const extraFormControls = Object.keys(this.filtersForm.controls).filter((controlName: string) => {
      controlName !== 'dateFrom' && controlName !== 'dateTo';
    });
    for (const control of extraFormControls) {
      this.filtersForm.removeControl(control);
    }
  }

  private setBaseFiltersForm(): void {
    const currentDate = new Date();
    const monthAgoDate = new Date(currentDate);
    monthAgoDate.setMonth(currentDate.getMonth() - 1);

    this.filtersForm = this.fb.group({
      dateFrom: new FormControl(monthAgoDate),
      dateTo: new FormControl(currentDate),
    });
  }
}
