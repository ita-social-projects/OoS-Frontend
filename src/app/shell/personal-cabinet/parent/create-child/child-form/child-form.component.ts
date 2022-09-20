import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SocialGroup } from 'src/app/shared/models/socialGroup.model';
import { Constants } from 'src/app/shared/constants/constants';
import { Util } from 'src/app/shared/utils/utils';
import { DATE_REGEX } from 'src/app/shared/constants/regex-constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Child } from 'src/app/shared/models/child.model';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss'],
})
export class ChildFormComponent implements OnInit {
  readonly validationConstants = ValidationConstants;
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;

  private readonly NONE_SOCIAL_GROUP_ID = 6;

  @Input() ChildFormGroup: UntypedFormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Input() socialGroups: SocialGroup[];

  @Output() deleteForm = new EventEmitter();

  @ViewChild('select') select: MatSelect;

  socialGroupControl: UntypedFormControl = new UntypedFormControl([]);
  dateFilter: RegExp = DATE_REGEX;
  maxDate: Date = Util.getMaxBirthDate();
  minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  ngOnInit(): void {
    this.socialGroupControl = this.ChildFormGroup.get('socialGroups') as UntypedFormControl;
  }

  /**
   * This method remove selected option from formControl
   * @param group SocialGroup
   */
  onRemoveItem(group: SocialGroup): void {
    this.socialGroupControl.value.splice(this.socialGroupControl.value.indexOf(group), 1);
    this.select.options.find((option: MatOption) => option.value.id === group.id).deselect();
  }

  /**
   * This method disabled option if there is selected value in social group form control and this value is None
   * @param option SocialGroup
   */
  checkDisabled(option: SocialGroup): boolean {
    if (!this.socialGroupControl.value.length) {
      return false;
    } else {
      const isNoneValueSelected = this.socialGroupControl.value.some(
        (group: SocialGroup) => group.id === this.NONE_SOCIAL_GROUP_ID
      );
      return option.id === this.NONE_SOCIAL_GROUP_ID ? !isNoneValueSelected : isNoneValueSelected;
    }
  }

  compareSocialGroups(group: SocialGroup, group2: SocialGroup): boolean {
    return group.id === group2.id;
  }

  onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
