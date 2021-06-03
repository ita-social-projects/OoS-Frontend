import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Constants } from '../../constants/constants';
import { WorkingDays } from '../../enum/working-hours';
import { SelectedWorkingHours, WorkingHours } from '../../models/workingHours.model';

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

  @Input() workHour: SelectedWorkingHours;

  @Input() index: number;
  @Input() workingHoursAmount: number;
  @Output() deleteWorkHour = new EventEmitter();

  touched = false;
  disabled = false;

  TimeFormGroup: FormGroup;

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

  constructor() { }

  ngOnInit(): void { }

  /**
  * This method check value, add it to the list of selected working days and distpatch filter action
  * @param day
  */
  onToggleDays(day: WorkingHours): void {
    this.markAsTouched();
    if (!this.disabled) {
      day.selected = !day.selected;
      if (day.selected) {
        this.workHour.day.push(day.value)
      } else {
        this.workHour.day.splice(this.workHour.day.indexOf(day.value), 1);
      }
      this.onChange(this.workHour);
    }
  }

  delete(): void {
    this.deleteWorkHour.emit();
  }

  onInputChange(time: string): void {
    this.onChange(this.workHour);
  }

  onChange = (selectedTime: SelectedWorkingHours) => { };
  onTouched = () => { };

  writeValue(selectedTime: SelectedWorkingHours) { }
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
}
