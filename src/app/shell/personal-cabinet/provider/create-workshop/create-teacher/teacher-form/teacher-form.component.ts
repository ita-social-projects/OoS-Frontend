import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { Constants, CropperConfigurationConstants } from 'src/app/shared/constants/constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent {
  readonly validationConstants = ValidationConstants;
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;
  readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    croppedWidth: CropperConfigurationConstants.croppedWidth,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    cropperAspectRatio: CropperConfigurationConstants.galleryImagesCropperAspectRatio
  }
  
  today: Date = new Date();

  @Input() index: number;
  @Input() TeacherFormGroup: FormGroup;
  @Input() teacherAmount: number;
  @Input() isRelease2: boolean;

  @Output() deleteForm = new EventEmitter();

  constructor() { }

  onDeleteTeacher(): void {
    this.deleteForm.emit(this.index);
  }
}
