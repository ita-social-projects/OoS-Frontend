import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { CropperConfigurationConstants } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent {
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

  constructor() {}

  public get TeacherForm(): FormGroup {
    return this.TeacherFormGroup as FormGroup;
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
