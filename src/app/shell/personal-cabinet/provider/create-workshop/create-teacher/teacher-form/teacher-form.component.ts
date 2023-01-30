import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { CropperConfigurationConstants } from '../../../../../../shared/constants/constants';
import { ValidationConstants } from '../../../../../../shared/constants/validation';
import { Util } from '../../../../../../shared/utils/utils';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent {
  readonly validationConstants = ValidationConstants;
  readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.coverImageCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedCoverImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality
  };

  today: Date = new Date();
  minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  @Input() index: number;
  @Input() TeacherFormGroup: FormGroup;
  @Input() teacherAmount: number;
  @Input() isRelease3: boolean;

  @Output() deleteForm = new EventEmitter();

  constructor() {}

  onDeleteTeacher(): void {
    this.deleteForm.emit(this.index);
  }
}
