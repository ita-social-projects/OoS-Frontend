import { ValidationConstants } from 'shared/constants/validation';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { WorkingDaysValues } from 'shared/constants/constants';
import { WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { WorkingDaysToggleValue } from 'shared/models/workingHours.model';

@Component({
  selector: 'app-working-hours-form',
  templateUrl: './working-hours-form.component.html',
  styleUrls: ['./working-hours-form.component.scss']
})
export class WorkingHoursFormComponent implements OnInit, OnDestroy {
  protected readonly ValidationConstants = ValidationConstants;

  public readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));
  public workingDays: string[] = [];
  public workdaysFormControl = new FormControl(['']);
  public startTimeFormControl = new FormControl('');
  public endTimeFormControl = new FormControl('');

  @Input() public workingHoursForm: FormGroup;
  @Input() public index: number;
  @Input() public workingHoursAmount: number;

  @Output() public deleteWorkingHour = new EventEmitter();

  constructor() {}

  public ngOnInit(): void {
    this.workdaysFormControl = this.workingHoursForm.get('workdays') as FormControl;
    this.startTimeFormControl = this.workingHoursForm.get('startTime') as FormControl;
    this.endTimeFormControl = this.workingHoursForm.get('endTime') as FormControl;

    this.workingHoursForm.valueChanges
      .pipe(
        filter(() => !this.workdaysFormControl.touched),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.workdaysFormControl.markAsTouched());

    this.workdaysFormControl.value.length && this.activateEditMode();
  }

  /**
   * This method check value, add it to the list of selected working days and distpatch filter action
   * @param day WorkingDaysToggleValue
   */
  public onToggleDays(day: WorkingDaysToggleValue): void {
    day.selected = !day.selected;
    if (day.selected) {
      this.workingDays.push(this.workingDaysReverse[day.value]);
    } else {
      this.workingDays.splice(this.workingDays.indexOf(day.value), 1);
    }

    const value = this.workingDays.length ? this.workingDays : null;
    this.workdaysFormControl.setValue(value);
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
  }

  public onCancel(): void {
    (this.startTimeFormControl.statusChanges as EventEmitter<any>).emit();
    (this.endTimeFormControl.statusChanges as EventEmitter<any>).emit();
  }

  public activateEditMode(): void {
    this.days.forEach((day: WorkingDaysToggleValue) => {
      this.workdaysFormControl.value.forEach((workDay: string) => {
        if (this.workingDaysReverse[day.value] === workDay.toLowerCase()) {
          day.selected = true;
          this.workingDays.push(workDay.toLowerCase());
        }
      });
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
