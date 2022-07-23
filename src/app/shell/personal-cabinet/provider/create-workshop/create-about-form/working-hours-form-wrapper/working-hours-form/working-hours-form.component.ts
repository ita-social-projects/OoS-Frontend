import { ValidationConstants } from '../../../../../../../shared/constants/validation';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { WorkingDaysValues } from '../../../../../../../shared/constants/constants';
import { WorkingDaysReverse } from '../../../../../../../shared/enum/enumUA/working-hours';
import { WorkingDaysToggleValue } from '../../../../../../../shared/models/workingHours.model';

@Component({
  selector: 'app-working-hours-form',
  templateUrl: './working-hours-form.component.html',
  styleUrls: ['./working-hours-form.component.scss']
})
export class WorkingHoursFormComponent implements OnInit, OnDestroy {
  readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;
  destroy$: Subject<boolean> = new Subject<boolean>();

  days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));
  workingDays: string[] = [];

  workdaysFormControl = new FormControl('');
  startTimeFormControl = new FormControl('');
  endTimeFormControl = new FormControl('');

  @Input() workingHoursForm: FormGroup;
  @Input() index: number;
  @Input() workingHoursAmount: number;

  @Output() deleteWorkingHour = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.workdaysFormControl = this.workingHoursForm.get('workdays') as FormControl;
    this.startTimeFormControl = this.workingHoursForm.get('startTime') as FormControl;
    this.endTimeFormControl = this.workingHoursForm.get('endTime') as FormControl;

    this.workingHoursForm.valueChanges.pipe(
      filter(()=> !this.workdaysFormControl.touched),
      takeUntil(this.destroy$)
    ).subscribe(()=> this.workdaysFormControl.markAsTouched());

    this.workdaysFormControl.value.length && this.activateEditMode();
  }

  /**
   * This method check value, add it to the list of selected working days and distpatch filter action
   * @param day WorkingDaysToggleValue
   */
  onToggleDays(day: WorkingDaysToggleValue): void {
    day.selected = !day.selected;
    if (day.selected) {
      this.workingDays.push(this.workingDaysReverse[day.value]);
    } else {
      this.workingDays.splice(this.workingDays.indexOf(day.value), 1);
    }

    const value = this.workingDays.length ? this.workingDays : null;
    this.workdaysFormControl.setValue(value);
  }

  getMinTime(): string {
    return this.startTimeFormControl.value ? this.startTimeFormControl.value : ValidationConstants.MAX_TIME;
  }

  delete(): void {
    this.deleteWorkingHour.emit(this.index);
  }

  onCancel(): void{
    (<EventEmitter<any>>this.startTimeFormControl.statusChanges).emit();
    (<EventEmitter<any>>this.endTimeFormControl.statusChanges).emit();
  }

  activateEditMode(): void {
    this.days.forEach((day: WorkingDaysToggleValue) => {
      this.workdaysFormControl.value.forEach((workDay: string) => {
        if (this.workingDaysReverse[day.value] === workDay.toLowerCase()) {
          day.selected = true;
          this.workingDays.push(day.value);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
