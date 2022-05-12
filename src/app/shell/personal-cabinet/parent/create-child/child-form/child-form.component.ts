import { ValidationTextField } from './../../../../../shared/constants/validation';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SocialGroup } from 'src/app/shared/models/socialGroup.model';
import { Util } from 'src/app/shared/utils/utils';
import { DATE_REGEX } from 'src/app/shared/constants/regex-constants'
import { ValidationConstants } from 'src/app/shared/constants/validation';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss'],
})
export class ChildFormComponent {
  readonly validationConstants = ValidationConstants;
  readonly validationTextField = ValidationTextField;

  @Input() ChildFormGroup: FormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Input() socialGroups: SocialGroup[];

  @Output() deleteForm = new EventEmitter();

  dateFilter: RegExp = DATE_REGEX;
  maxDate: Date = Util.getMaxBirthDate();
  minDate: Date = Util.getMinBirthDate();

  constructor() { }

  onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
