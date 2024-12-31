import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TIME_REGEX_REPLACE } from 'shared/constants/regex-constants';
import { WorkingDaysValues } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';
import { TimeRangeValidator } from 'shared/validators/time-range-validator';
import { TimeFormatValidator } from 'shared/validators/time-format-validator';

@Component({
  selector: 'app-working-hours-form',
  templateUrl: './working-hours-form.component.html',
  styleUrls: ['./working-hours-form.component.scss']
})
export class WorkingHoursFormComponent implements OnInit, OnDestroy {
  @Input() public workingHoursForm: AbstractControl;
  @Input() public index: number;
  @Input() public workingHoursAmount: number;

  @Output() public deleteWorkingHour = new EventEmitter();
  @Output() public dataChanged = new EventEmitter<void>();

  public isEditMode: boolean = false;
  public fromTime: string = '';
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => ({ ...value }));
  public workingDays: Set<string> = new Set<string>();
  public workdaysFormControl = new FormControl(['']);
  public startTimeFormControl = new FormControl('');
  public endTimeFormControl = new FormControl('');

  protected readonly ValidationConstants = ValidationConstants;
  protected readonly workingDaysReverse = WorkingDaysReverse;

  public ngOnInit(): void {
    this.workdaysFormControl = this.workingHoursForm.get('workdays') as FormControl;
    this.startTimeFormControl = this.workingHoursForm.get('startTime') as FormControl;
    this.endTimeFormControl = this.workingHoursForm.get('endTime') as FormControl;

    this.endTimeFormControl.setValidators(TimeFormatValidator);
    this.startTimeFormControl.setValidators(TimeFormatValidator);

    (this.workingHoursForm as FormGroup).setValidators(TimeRangeValidator('startTime', 'endTime'));

    if (!this.workdaysFormControl.value) {
      this.startTimeFormControl.disable({ emitEvent: false });
      this.endTimeFormControl.disable({ emitEvent: false });
    }

    this.startTimeFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.startTimeFormControl.setValue(this.validateTimeInput(value), { emitEvent: false });
      if (value) {
        this.endTimeFormControl.enable({ emitEvent: false });
      } else {
        this.endTimeFormControl.disable({ emitEvent: false });
      }
    });

    this.endTimeFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.endTimeFormControl.setValue(this.validateTimeInput(value), { emitEvent: false });
    });

    if (this.workdaysFormControl.value.length) {
      this.activateEditMode();
    }
  }

  /**
   * This method check value, add it to the list of selected working days and dispatch filter action
   * @param day WorkingDaysToggleValue
   */
  public onToggleDays(day: WorkingDaysToggleValue): void {
    day.selected = !day.selected;
    if (day.selected) {
      this.workingDays.add(this.workingDaysReverse[day.value]);
    } else {
      this.workingDays.delete(this.workingDaysReverse[day.value]);
    }

    if (this.workingDays.size) {
      this.startTimeFormControl.enable({ emitEvent: false });
      this.startTimeFormControl.updateValueAndValidity();
    } else {
      this.startTimeFormControl.disable({ emitEvent: false });
      this.endTimeFormControl.disable({ emitEvent: false });
    }

    const value = this.workingDays.size ? [...this.workingDays] : null;
    this.workdaysFormControl.setValue(value);
    this.dataChanged.emit();
  }

  public delete(): void {
    this.deleteWorkingHour.emit(this.index);
    this.dataChanged.emit();
  }

  public onCancel(): void {
    (this.startTimeFormControl.statusChanges as EventEmitter<any>).emit();
    (this.endTimeFormControl.statusChanges as EventEmitter<any>).emit();
  }

  public activateEditMode(): void {
    this.isEditMode = true;
    this.days.forEach((day: WorkingDaysToggleValue) => {
      this.workdaysFormControl.value.forEach((workDay: string) => {
        if (this.workingDaysReverse[day.value] === workDay.toLowerCase()) {
          day.selected = true;
          this.workingDays.add(workDay.toLowerCase());
        }
      });
    });
    this.workingHoursForm.markAllAsTouched();
  }

  public onTimeSet(chosenTime: string, formControl: FormControl): void {
    formControl.setValue(chosenTime);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public validateTimeInput(value: string): string {
    return value.replace(TIME_REGEX_REPLACE, '');
  }

  public markWorkDaysAsTouched(): void {
    this.workdaysFormControl.markAsTouched();
    this.workdaysFormControl.setErrors({ required: true });
  }
}
