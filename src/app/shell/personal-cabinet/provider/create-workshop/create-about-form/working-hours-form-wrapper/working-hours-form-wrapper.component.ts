import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DateTimeRanges } from 'shared/models/workingHours.model';
import { Workshop } from 'shared/models/workshop.model';

@Component({
  selector: 'app-working-hours-form-wrapper',
  templateUrl: './working-hours-form-wrapper.component.html',
  styleUrls: ['./working-hours-form-wrapper.component.scss']
})
export class WorkingHoursFormWrapperComponent implements OnInit {
  @Input() public workshop: Workshop;
  @Input() public workingHoursFormArray: FormArray;
  public workingHoursFormGroup: FormGroup;

  @Output() public dataChangedInChild = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.workshop ? this.activateEditMode() : this.addWorkingHours();
  }

  private activateEditMode(): void {
    if (this.workshop.dateTimeRanges.length) {
      this.workshop.dateTimeRanges.forEach((range: DateTimeRanges) => this.addWorkingHours(range));
    } else {
      this.addWorkingHours();
    }
  }

  /**
   * This method create new FormGroup add new FormGroup to the FormArray
   */
  public addWorkingHours(range?: DateTimeRanges): void {
    const formGroup = this.newWorkingHoursForm(range);
    this.workingHoursFormArray.controls.push(formGroup); // for preventing emitting value changes in edit mode on initial value set
    this.workingHoursFormArray['_registerControl'](formGroup);
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index: number
   */
  public deleteWorkingHour(index: number): void {
    this.workingHoursFormArray.removeAt(index);
  }

  /**
   * This method create new FormGroup
   * @param DateTimeRanges range
   */
  private newWorkingHoursForm(range?: DateTimeRanges): FormGroup {
    this.workingHoursFormGroup = this.formBuilder.group({
      workdays: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required)
    });
    if (range) {
      this.workingHoursFormGroup.addControl('id', this.formBuilder.control(''));
      this.workingHoursFormGroup.setValue(range);
    }

    return this.workingHoursFormGroup;
  }

  public onDataChanged(): void {
    this.dataChangedInChild.emit();
  }
}
