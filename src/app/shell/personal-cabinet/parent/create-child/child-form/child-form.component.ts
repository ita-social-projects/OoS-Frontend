import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SocialGroup } from 'src/app/shared/models/socialGroup.model';
import { Constants } from 'src/app/shared/constants/constants'
import { Util } from 'src/app/shared/utils/utils';
import { DATE_REGEX } from 'src/app/shared/constants/regex-constants'
import { ValidationConstants } from 'src/app/shared/constants/validation';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss'],
})
export class ChildFormComponent implements OnInit {
  readonly validationConstants = ValidationConstants;
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;

  @Input() ChildFormGroup: FormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Input() socialGroups: SocialGroup[];

  @Output() deleteForm = new EventEmitter();

  dateFilter: RegExp = DATE_REGEX;
  maxDate: Date = Util.getMaxBirthDate();
  minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  constructor() { }

  ngOnInit(): void { }

  onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
