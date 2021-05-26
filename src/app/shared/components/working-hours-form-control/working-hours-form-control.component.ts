import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Constants } from '../../constants/constants';
import { WorkingDays, WorkingTime } from '../../enum/working-hours';
import { WorkingHours } from '../../models/workingHours.model';

interface SelectedTime {
  day: string;
  timeFrom: string;
  timeTo: string;
}
@Component({
  selector: 'app-working-hours-form-control',
  templateUrl: './working-hours-form-control.component.html',
  styleUrls: ['./working-hours-form-control.component.scss']
})
export class WorkingHoursFormControlComponent implements OnInit {

  readonly constants: typeof Constants = Constants;


  selectedWorkingHours: SelectedTime = {
    day: '',
    timeFrom: '',
    timeTo: ''
  };

  @Output() passTimeFormGroup = new EventEmitter();
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

  constructor(private formBuilder: FormBuilder) {
    this.TimeFormGroup = this.formBuilder.group({
      timeFrom: new FormControl(''),
      timeTo: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.TimeFormGroup.get('timeFrom').valueChanges.subscribe((val) => {
      if (val && this.selectedWorkingHours.day)
        this.selectedWorkingHours.timeFrom = val;
    })
    this.TimeFormGroup.get('timeTo').valueChanges.subscribe((val) => {
      if (val && this.selectedWorkingHours.day)
        this.selectedWorkingHours.timeTo = val;
    })
  }

  /**
  * This method check value, add it to the list of selected working days and distpatch filter action
  * @param day
  */
  onToggleDays(day: WorkingHours): void {
    this.markAsTouched();
    if (!this.disabled) {
      for (let i = 0; i < this.days.length; i++) {
        if (this.days[i].value === day.value) {
          this.days[i].selected = true;
          this.selectedWorkingHours.day = day.value;
          this.onChange(this.selectedWorkingHours);
        } else {
          this.days[i].selected = false;
        }

        console.log(this.selectedWorkingHours)
      }
    }
  }

  onChange = (selectedTime: SelectedTime) => { };
  onTouched = () => { };

  writeValue(selectedTime: SelectedTime) {
  }
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
