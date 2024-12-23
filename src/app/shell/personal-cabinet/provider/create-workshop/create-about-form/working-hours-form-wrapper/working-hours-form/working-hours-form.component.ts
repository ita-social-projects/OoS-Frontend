import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { WorkingDaysValues } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';

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
  public workdaysFormControl = new FormControl([''], [Validators.required]);
  public startTimeFormControl = new FormControl('', [Validators.required]);
  public endTimeFormControl = new FormControl('', [Validators.required]);

  protected readonly ValidationConstants = ValidationConstants;
  protected readonly workingDaysReverse = WorkingDaysReverse;

  public ngOnInit(): void {
    this.workdaysFormControl = this.workingHoursForm.get('workdays') as FormControl;
    this.startTimeFormControl = this.workingHoursForm.get('startTime') as FormControl;
    this.endTimeFormControl = this.workingHoursForm.get('endTime') as FormControl;

    this.endTimeFormControl.setValidators(timeFormatValidator());
    this.startTimeFormControl.setValidators(timeFormatValidator());

    (this.workingHoursForm as FormGroup).setValidators(timeRangeValidator('startTime', 'endTime'));

    this.workingHoursForm.valueChanges
      .pipe(
        filter(() => !this.workdaysFormControl.touched),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.workdaysFormControl.markAsTouched());

    if (!this.startTimeFormControl.value) {
      this.endTimeFormControl.disable({ emitEvent: false });
    }

    this.startTimeFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.endTimeFormControl.enable({ emitEvent: false });
      } else {
        this.endTimeFormControl.disable({ emitEvent: false });
      }
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
      this.endTimeFormControl.enable({ emitEvent: false });
    } else {
      this.startTimeFormControl.disable({ emitEvent: false });
      this.endTimeFormControl.disable({ emitEvent: false });
    }

    const value = this.workingDays.size ? [...this.workingDays] : null;
    this.workdaysFormControl.setValue(value);
    this.dataChanged.emit();
  }

  public getMinTime(): string {
    const startTimeString = this.startTimeFormControl.value ? this.startTimeFormControl.value : ValidationConstants.MAX_TIME;
    const [startHours, startMinutes] = startTimeString.split(':').map(Number);

    let newMinutes = startMinutes + 1;
    let newHours = startHours;

    if (newMinutes >= 60) {
      newMinutes = 0;
      newHours++;
    }

    newHours = newHours % 24;

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  }

  public getMaxTime(): string {
    const endTimeString = this.endTimeFormControl.value ? this.endTimeFormControl.value : ValidationConstants.MAX_TIME;
    const [endHours, endMinutes] = endTimeString.split(':').map(Number);

    let newMinutes = endMinutes - 1;
    let newHours = endHours;

    if (newMinutes < 0) {
      newMinutes = 59;
      newHours--;
    }

    if (newHours < 0) {
      newHours = 23;
    }

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
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
  }

  public onStartTimeSet(chosenTime: string): void {
    this.startTimeFormControl.setValue(chosenTime);
  }

  public onEndTimeSet(chosenTime: string): void {
    this.endTimeFormControl.setValue(chosenTime);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onStartBlur(): void {
    if (!this.startTimeFormControl.value) {
      this.startTimeFormControl.setValue(this.getMaxTime());
    }
  }

  public onEndBlur(): void {
    if (!this.endTimeFormControl.value) {
      this.endTimeFormControl.setValue(this.getMinTime());
    }
  }

  public validateTimeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanedValue = input.value.replace(/[^0-9:]/g, '');
    input.value = cleanedValue;
  }
}

export function timeFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const timePattern = /^(2[0-3]|[01]?\d):([0-5]\d)$/;
    const valid = timePattern.test(value);
    return valid ? null : { invalidTimeFormat: true };
  };
}

export function timeRangeValidator(startCtrlName: string = 'startTime', endCtrlName: string = 'endTime'): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startCtrl = formGroup.get(startCtrlName);
    const endCtrl = formGroup.get(endCtrlName);

    if (!startCtrl || !endCtrl) {
      return null;
    }

    const startTime = startCtrl.value;
    const endTime = endCtrl.value;

    removeControlErrorKey(startCtrl, 'invalidTimeRange');
    removeControlErrorKey(endCtrl, 'invalidTimeRange');

    if (!startTime || !endTime || startCtrl.hasError('invalidTimeFormat') || endCtrl.hasError('invalidTimeFormat')) {
      const { invalidTimeRange, ...rest } = formGroup.errors || {};
      return Object.keys(rest).length ? rest : null;
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (startTotal >= endTotal) {
      const currentGroupErrors = formGroup.errors || {};
      const newGroupErrors = { ...currentGroupErrors, invalidTimeRange: true };

      const startErr = startCtrl.errors || {};
      startCtrl.setErrors({ ...startErr, invalidTimeRange: true });

      const endErr = endCtrl.errors || {};
      endCtrl.setErrors({ ...endErr, invalidTimeRange: true });

      return newGroupErrors;
    } else {
      const { invalidTimeRange, ...rest } = formGroup.errors || {};
      return Object.keys(rest).length ? rest : null;
    }
  };
}

function removeControlErrorKey(control: AbstractControl, key: string): void {
  if (!control.errors) {
    return;
  }
  const { [key]: _, ...others } = control.errors;
  control.setErrors(Object.keys(others).length ? others : null);
}
