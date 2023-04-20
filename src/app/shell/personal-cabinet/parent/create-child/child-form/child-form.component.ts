import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { DATE_REGEX } from '../../../../../shared/constants/regex-constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { Util } from '../../../../../shared/utils/utils';
import { DataItem } from '../../../../../shared/models/item.model';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss']
})
export class ChildFormComponent implements OnInit {
  readonly validationConstants = ValidationConstants;

  private readonly NONE_SOCIAL_GROUP_ID = 6;

  @Input() ChildFormGroup: FormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Input() socialGroups: DataItem[];

  @Output() deleteForm = new EventEmitter();

  @ViewChild('select') select: MatSelect;

  socialGroupControl: FormControl = new FormControl([]);
  dateFilter: RegExp = DATE_REGEX;
  maxDate: Date = Util.getMaxBirthDate();
  minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  ngOnInit(): void {
    this.socialGroupControl = this.ChildFormGroup.get('socialGroups') as FormControl;
  }

  /**
   * This method remove selected option from formControl
   * @param group SocialGroup
   */
  onRemoveItem(group: DataItem): void {
    this.socialGroupControl.value.splice(this.socialGroupControl.value.indexOf(group), 1);
    this.select.options.find((option: MatOption) => option.value.id === group.id).deselect();
  }

  /**
   * This method disabled option if there is selected value in social group form control and this value is None
   * @param option SocialGroup
   */
  checkDisabled(option: DataItem): boolean {
    if (!this.socialGroupControl.value.length) {
      return false;
    } else {
      const isNoneValueSelected = this.socialGroupControl.value.some((group: DataItem) => group.id === this.NONE_SOCIAL_GROUP_ID);
      return option.id === this.NONE_SOCIAL_GROUP_ID ? !isNoneValueSelected : isNoneValueSelected;
    }
  }

  compareSocialGroups(group: DataItem, group2: DataItem): boolean {
    return group.id === group2.id;
  }

  onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
