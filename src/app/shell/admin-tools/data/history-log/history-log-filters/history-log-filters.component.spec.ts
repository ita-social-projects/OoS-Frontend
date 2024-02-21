import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { FilterOptions } from 'shared/enum/history.log';
import { HistoryLogFiltersComponent } from './history-log-filters.component';

describe('HistoryLogFiltersComponent', () => {
  let component: HistoryLogFiltersComponent;
  let fixture: ComponentFixture<HistoryLogFiltersComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [HistoryLogFiltersComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryLogFiltersComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    component.filtersForm = formBuilder.group({
      [FilterOptions.dateFrom]: formBuilder.control(''),
      [FilterOptions.dateTo]: formBuilder.control('')
    });
    component.filtersForm.addControl(component.formControlName, new FormControl(''));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applyFilters method', () => {
    let dateFrom: Date;
    let dateTo: Date;
    let filterDataSpy: jest.SpyInstance;

    beforeEach(() => {
      dateFrom = component.filtersForm.value.dateFrom;
      dateTo = component.filtersForm.value.dateTo;
      filterDataSpy = jest.spyOn(component.filterData, 'emit');
      component.filtersForm.controls[component.formControlName].setValue('Testing value');
    });

    it('should emit filterData with correct data', () => {
      component.filtersForm.controls.dateFrom.setValue(new Date('Sun Jan 21 2024 11:43:55'));
      component.filtersForm.controls.dateTo.setValue(new Date('Thu Feb 21 2024 05:34:51'));
      const expectedFilterData = {
        dateFrom: 'Sun, 21 Jan 2024 00:00:00 GMT',
        dateTo: 'Wed, 21 Feb 2024 23:59:59 GMT',
        [component.formControlName]: 'Testing value'
      };

      component.applyFilters();

      expect(filterDataSpy).toHaveBeenCalledTimes(1);
      expect(filterDataSpy).toHaveBeenCalledWith(expectedFilterData);
    });

    it('should emit filterData with empty string in dateFrom and dateTo when dates are reset', () => {
      component.filtersForm.controls.dateFrom.setValue('');
      component.filtersForm.controls.dateTo.setValue('');
      const expectedFilterData = {
        dateFrom: '',
        dateTo: '',
        [component.formControlName]: 'Testing value'
      };

      component.applyFilters();

      expect(filterDataSpy).toHaveBeenCalledTimes(1);
      expect(filterDataSpy).toHaveBeenCalledWith(expectedFilterData);
    });
  });

  describe('onResetFilters method', () => {
    it('should reset filtersForm', () => {
      const filtersFormResetSpy = jest.spyOn(component.filtersForm, 'reset');

      component.onResetFilters();

      expect(filtersFormResetSpy).toHaveBeenCalledTimes(1);
    });

    it('should set value as empty string to all filtersForm controls', () => {
      Object.keys(component.filtersForm.controls).forEach((control: string) => {
        component.filtersForm.controls[control].setValue('Testing value');
      });
      const formControlSetValueSpy = jest.spyOn(FormControl.prototype, 'setValue');

      component.onResetFilters();

      Object.keys(component.filtersForm.controls).forEach(() => {
        expect(formControlSetValueSpy).toHaveBeenCalledWith('');
      });
      Object.keys(component.filtersForm.controls).forEach((control: string) => {
        expect(component.filtersForm.controls[control].value).toBe('');
      });
    });

    it('should emit dateFromFilters with empty strings', () => {
      const dateFromFiltersSpy = jest.spyOn(component.dateFromFilters, 'emit');
      const expectedDateFromFilters = { [FilterOptions.dateFrom]: '', [FilterOptions.dateTo]: '' };

      component.onResetFilters();

      expect(dateFromFiltersSpy).toHaveBeenCalledTimes(1);
      expect(dateFromFiltersSpy).toHaveBeenCalledWith(expectedDateFromFilters);
    });
  });

  describe('setDateForFilters method', () => {
    let dateFrom: Date;
    let dateTo: Date;

    beforeEach(() => {
      component.filtersForm.controls.dateFrom.setValue(new Date('Sun Jan 21 2024 11:43:55'));
      component.filtersForm.controls.dateTo.setValue(new Date('Thu Feb 21 2024 05:34:51'));
      dateFrom = component.filtersForm.value.dateFrom;
      dateTo = component.filtersForm.value.dateTo;
    });

    it('should set correct time to dateFrom equal to 00:00:00', () => {
      const expectedTimeInDate = {
        hours: 0,
        minutes: 0,
        seconds: 0
      };

      component.setDateForFilters();

      expect(dateFrom.getHours()).toBe(expectedTimeInDate.hours);
      expect(dateFrom.getMinutes()).toBe(expectedTimeInDate.minutes);
      expect(dateFrom.getSeconds()).toBe(expectedTimeInDate.seconds);
    });

    it('should set correct time to dateTo equal to 23:59:59', () => {
      const expectedTimeInDate = {
        hours: 23,
        minutes: 59,
        seconds: 59
      };

      component.setDateForFilters();

      expect(dateTo.getHours()).toBe(expectedTimeInDate.hours);
      expect(dateTo.getMinutes()).toBe(expectedTimeInDate.minutes);
      expect(dateTo.getSeconds()).toBe(expectedTimeInDate.seconds);
    });

    it('should emit dateFromFilters with correct values', () => {
      const dateFromFiltersSpy = jest.spyOn(component.dateFromFilters, 'emit');
      const expectedDateFilters = {
        dateFrom: 'Sun, 21 Jan 2024 00:00:00 GMT',
        dateTo: 'Wed, 21 Feb 2024 23:59:59 GMT'
      };

      component.setDateForFilters();

      expect(dateFromFiltersSpy).toHaveBeenCalledTimes(1);
      expect(dateFromFiltersSpy).toHaveBeenCalledWith(expectedDateFilters);
    });
  });
});
