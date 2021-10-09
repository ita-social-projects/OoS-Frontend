import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Constants } from '../../constants/constants';
import { WorkingDays, WorkingDaysReverse } from '../../enum/enumUA/working-hours';
import { DateTimeRanges, WorkingHours } from '../../models/workingHours.model';

@Component({
  selector: 'app-working-hours-form-control',
  templateUrl: './working-hours-form-control.component.html',
  styleUrls: ['./working-hours-form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: WorkingHoursFormControlComponent
    }
  ]
})
export class WorkingHoursFormControlComponent implements OnInit {

  readonly constants: typeof Constants = Constants;
  readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;


  @Input() workingHoursForm: FormGroup;

  @Input() index: number;
  @Input() workingHoursAmount: number;
  @Output() deleteWorkHour = new EventEmitter();
  @Output() PassTimeFormGroup = new EventEmitter();


  touched = false;
  disabled = false;

  timeFormGroup: FormGroup;
  workingDays: string[] = [];

  days: WorkingHours[] = [
    {
      value: WorkingDays.monday,
      selected: false,
    },
    {
      value: WorkingDays.tuesday,
      selected: false,
    },
    {
      value: WorkingDays.wednesday,
      selected: false,
    },
    {
      value: WorkingDays.thursday,
      selected: false,
    },
    {
      value: WorkingDays.friday,
      selected: false,
    },
    {
      value: WorkingDays.saturday,
      selected: false,
    },
    {
      value: WorkingDays.sunday,
      selected: false,
    }
  ];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    // this.workingHours && this.activateEditMode();
  }


  /**
  * This method check value, add it to the list of selected working days and distpatch filter action
  * @param day
  */
  onToggleDays(day: WorkingHours): void {
    this.markAsTouched();
    if (!this.disabled) {
      day.selected = !day.selected;
      if (day.selected) {
        this.workingDays.push(this.workingDaysReverse[day.value])
      } else {
        this.workingDays.splice(this.workingDays.indexOf(day.value), 1);
      }
      this.workingHoursForm.get('workingHours').setValue(this.workingDays)
    }
  }

  getMinTime(): string {
    return this.workingHoursForm.get('startTime').value ? this.workingHoursForm.get('startTime').value : '00:01';
  }
  getMaxTime(): string {
    return this.workingHoursForm.get('endTime').value ? this.workingHoursForm.get('endTime').value : '23:59';
  }

  delete(): void {
    this.deleteWorkHour.emit();
  }

  onInputChange(time: string): void {
    this.onChange();
  }

  onChange = () => { };
  onTouched = () => { };

  writeValue(selectedTime: DateTimeRanges) { }
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  // private activateEditMode(): void {
  //   this, this.timeFormGroup.setValue(this.workingHours);

  //   this.days.forEach((day: WorkingHours) => {
  //     this.workingHours.workdays.forEach((workDay: string) => {
  //       if (this.workingDaysReverse[day.value] === workDay.toLowerCase()) {
  //         day.selected = true;
  //       }
  //     })
  //   });
  // }
}
