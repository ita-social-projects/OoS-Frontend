import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DateFilters, DropdownData, FilterData } from 'shared/models/history-log.model';
import { FilterOptions, FormControlNames, HistoryLogTypes, CustomFormControlNames } from 'shared/enum/history.log';
import { DropdownOptionsConfig } from 'shared/constants/drop-down';

@Component({
  selector: 'app-history-log-filters',
  templateUrl: './history-log-filters.component.html',
  styleUrls: ['./history-log-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryLogFiltersComponent implements OnInit {
  @Input() public dropdownOptions: DropdownData;

  @Output() public filterData = new EventEmitter<FilterData>();
  @Output() public dateFromFilters = new EventEmitter<DateFilters>();

  public readonly dropdownOptionsConfig = DropdownOptionsConfig;
  public filtersForm: FormGroup;
  public maxDate = new Date();
  public notAllowedToPickByTabButton = -1;
  public filtersList = [];

  private baseCountOfFiltersFormFields = 2;
  private _tabName: HistoryLogTypes;

  constructor(private fb: FormBuilder) {}

  public get tabName(): HistoryLogTypes {
    return this._tabName;
  }

  @Input() public set tabName(newTabName: HistoryLogTypes) {
    this._tabName = newTabName;
    this.filtersList = [];
    if (this.filtersForm && Object.keys(this.filtersForm.controls).length > this.baseCountOfFiltersFormFields) {
      this.removeExtraFormControls();
    }
    this.setFiltersDependOnTab(newTabName);
  }

  public ngOnInit(): void {
    this.setBaseFiltersForm();
    this.emitFilterData();
  }

  public applyFilters(): void {
    this.emitFilterData();
  }

  public onResetFilters(): void {
    this.filtersForm.reset();
    Object.keys(this.filtersForm.controls).forEach((control: string) => {
      this.filtersForm.get(control).setValue('');
    });
    this.dateFromFilters.emit({ [FilterOptions.DateFrom]: '', [FilterOptions.DateTo]: '' });
  }

  public setDateForFilters(): void {
    const { dateFrom, dateTo } = this.filtersForm.value;
    const dateFilters = this.setTimePeriodEqualToWholeDay(dateFrom, dateTo);
    this.dateFromFilters.emit(dateFilters);
  }

  private setFiltersDependOnTab(tabName: HistoryLogTypes): void {
    switch (tabName) {
      case HistoryLogTypes.Providers:
        this.addFormControlForFiltersForm([CustomFormControlNames.ProvidersPropertyName]);
        break;
      case HistoryLogTypes.ProviderAdmins:
        this.addFormControlForFiltersForm([CustomFormControlNames.OperationType, CustomFormControlNames.AdminType]);
        break;
      case HistoryLogTypes.Applications:
        this.addFormControlForFiltersForm([CustomFormControlNames.ApplicationsPropertyName]);
        break;
      case HistoryLogTypes.Users:
        this.addFormControlForFiltersForm([CustomFormControlNames.ShowParents]);
        break;
    }
  }

  private removeExtraFormControls(): void {
    const extraFormControls = Object.keys(this.filtersForm.controls).filter(
      (controlName: string) => controlName !== FilterOptions.DateFrom && controlName !== FilterOptions.DateTo
    );
    for (const control of extraFormControls) {
      this.filtersForm.removeControl(control);
    }
  }

  private setBaseFiltersForm(): void {
    const currentDate = new Date();
    const monthAgoDate = new Date();
    monthAgoDate.setMonth(currentDate.getMonth() - 1);

    this.filtersForm = this.fb.group({
      [FilterOptions.DateFrom]: new FormControl(monthAgoDate),
      [FilterOptions.DateTo]: new FormControl(currentDate)
    });
  }

  private emitFilterData(): void {
    const { dateFrom, dateTo, ...restFilters } = this.filtersForm.value;

    if (dateFrom && dateTo) {
      const filtersWithEditedTime = this.setTimePeriodEqualToWholeDay(dateFrom, dateTo);
      Object.assign(filtersWithEditedTime, restFilters);
      this.filterData.emit(filtersWithEditedTime);
    } else {
      this.filterData.emit(this.filtersForm.value);
    }
  }

  private setCustomTimeInDate(date: Date, hours: number, minutes: number, seconds: number): void {
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
  }

  private setTimeDependsOnTimezone(dateFrom: Date, dateTo: Date): FilterData {
    const timezoneGap = dateFrom.getTimezoneOffset() * 60 * 1000;
    const dateFromWithTimezoneGap = dateFrom.getTime() - timezoneGap;
    const dateToWithTimezoneGap = dateTo.getTime() - timezoneGap;

    return {
      [FilterOptions.DateFrom]: new Date(dateFromWithTimezoneGap).toUTCString(),
      [FilterOptions.DateTo]: new Date(dateToWithTimezoneGap).toUTCString()
    };
  }

  private setTimePeriodEqualToWholeDay(dateFrom: Date, dateTo: Date): FilterData {
    this.setCustomTimeInDate(dateFrom, 0, 0, 0);
    this.setCustomTimeInDate(dateTo, 23, 59, 59);

    return this.setTimeDependsOnTimezone(dateFrom, dateTo);
  }

  private addFormControlForFiltersForm(formControlNames: string[]): void {
    formControlNames.forEach((controlName: string) => {
      this.filtersForm.addControl(FormControlNames[controlName], new FormControl(''));
      this.filtersList.push({
        controlName: FormControlNames[controlName],
        options: this.dropdownOptionsConfig[controlName]
      });
    });
  }
}
