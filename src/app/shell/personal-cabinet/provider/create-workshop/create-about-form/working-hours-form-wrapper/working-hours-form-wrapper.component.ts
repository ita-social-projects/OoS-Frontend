import { Workshop } from 'src/app/shared/models/workshop.model';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DateTimeRanges } from '../../../../../../shared/models/workingHours.model';

@Component({
  selector: 'app-working-hours-form-wrapper',
  templateUrl: './working-hours-form-wrapper.component.html',
  styleUrls: ['./working-hours-form-wrapper.component.scss']
})
export class WorkingHoursFormWrapperComponent implements OnInit {
  @Input() workshop: Workshop;
  @Input() workingHoursFormArray: UntypedFormArray;

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.workshop ? this.activateEditMode() : this.addWorkingHours();
  }

  private activateEditMode(): void {
    this.workshop.dateTimeRanges.forEach((range: DateTimeRanges) => this.addWorkingHours(range));
  }

  /**
   * This method create new FormGroup add new FormGroup to the FormArray
   */
  addWorkingHours(range?: DateTimeRanges): void {
    const formGroup = this.newWorkingHoursForm(range)
    this.workingHoursFormArray.controls.push(formGroup); //for preventing emitting value changes in edit mode on initial value set
    this.workingHoursFormArray['_registerControl'](formGroup);
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index: number
   */
  deleteWorkingHour(index: number): void {
    this.workingHoursFormArray.removeAt(index);
  }

  /**
   * This method create new FormGroup
   * @param DateTimeRanges range
   */
  private newWorkingHoursForm(range?: DateTimeRanges): UntypedFormGroup {
    const workingHoursFormGroup = this.formBuilder.group({
      workdays: new UntypedFormControl('', Validators.required),
      startTime: new UntypedFormControl('', Validators.required),
      endTime: new UntypedFormControl('', Validators.required),
    });
    if (range) {
      workingHoursFormGroup.addControl('id', this.formBuilder.control(''));
      workingHoursFormGroup.setValue(range);
    }
  
    return workingHoursFormGroup;
  }
}
