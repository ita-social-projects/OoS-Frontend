import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';

import { CropperConfigurationConstants } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {
  @Input() public index: number;
  @Input() public TeacherFormGroup: AbstractControl;
  @Input() public teacherAmount: number;
  @Input() public isImagesFeature: boolean;

  @Output() public deleteForm = new EventEmitter();

  public readonly validationConstants = ValidationConstants;
  public readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.coverImageCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedCoverImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality
  };

  public today: Date = new Date();
  public minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  private readonly defaultDebounceTime: number = 300;

  constructor() {}

  public get TeacherForm(): FormGroup {
    return this.TeacherFormGroup as FormGroup;
  }

  public ngOnInit(): void {
    this.TeacherForm.get('defaultTeacher')
      ?.valueChanges.pipe(debounceTime(this.defaultDebounceTime), filter(Boolean))
      .subscribe(() => {
        // take form array from create-teacher component
        const parentArray = this.TeacherForm.parent as FormArray;

        if (parentArray) {
          parentArray.controls
            .filter((control) => control !== this.TeacherForm)
            .forEach((control) => {
              control.get('defaultTeacher')?.setValue(false, { emitEvent: false });
            });
        }
      });
  }

  public onDeleteTeacher(): void {
    this.deleteForm.emit(this.index);
  }

  public onFocusOut(formControlName: string): void {
    if (this.TeacherFormGroup.get(formControlName).pristine && !this.TeacherFormGroup.get(formControlName).value) {
      this.TeacherFormGroup.get(formControlName).setValue(null);
    }
  }
}
