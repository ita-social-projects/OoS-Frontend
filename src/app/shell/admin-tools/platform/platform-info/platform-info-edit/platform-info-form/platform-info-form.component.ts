import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';

@Component({
  selector: 'app-platform-info-form',
  templateUrl: './platform-info-form.component.html',
  styleUrls: ['./platform-info-form.component.scss']
})
export class PlatformInfoFormComponent {
  readonly validationConstants = ValidationConstants;

  @Input() PlatformInfoEditFormGroup: FormGroup;
  @Input() index: number;
  @Input() formAmount: number;

  @Output() deleteForm = new EventEmitter();

  constructor() { }

  onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
