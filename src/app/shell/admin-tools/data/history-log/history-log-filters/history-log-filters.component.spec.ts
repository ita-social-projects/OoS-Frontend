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
});
