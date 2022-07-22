import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SocialGroup } from 'src/app/shared/models/socialGroup.model';
import { Constants } from 'src/app/shared/constants/constants'
import { Util } from 'src/app/shared/utils/utils';
import { DATE_REGEX } from 'src/app/shared/constants/regex-constants'
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss'],
})
export class ChildFormComponent {
  readonly validationConstants = ValidationConstants;
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;

  public selectedSocialGroups: SocialGroup[] = [];

  @Input() ChildFormGroup: FormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Input() socialGroups: SocialGroup[];

  @Output() deleteForm = new EventEmitter();

  dateFilter: RegExp = DATE_REGEX;
  maxDate: Date = Util.getMaxBirthDate();
  minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  onRemoveItem(item: string): void {
    const items = this.selectedSocialGroups;
    if (items[item] >= 0) {
      items.splice(items[item], 1);
      if (items.length) {
        this.selectedSocialGroups = [...items];
      } else {
        this.selectedSocialGroups = [];
      }
    }
  }

  checkGroupSelection(group: SocialGroup): boolean {
    let isDisabled = false;
    if (this.selectedSocialGroups && this.selectedSocialGroups.length) {
      this.selectedSocialGroups.forEach((element: SocialGroup) => {
        if (element.name === 'Відсутня') {
          isDisabled = group.name !== 'Відсутня';
        }
      })
    }
    return isDisabled;
  }

  onSelectChange(event: MatSelectChange): any {
    this.selectedSocialGroups = [...event.value];
    this.selectedSocialGroups.forEach((element, index) => {
      if (element.name === 'Відсутня') {
        this.selectedSocialGroups = [];
        this.selectedSocialGroups = [...this.selectedSocialGroups, element];
        const matSelect: MatSelect = event.source;
        console.log(matSelect.value)
        matSelect.writeValue([{...element}]); 
        console.log(matSelect.value)
      }
    })
    // if (this.selectedSocialGroups.values.name.includes('Відсутня')) {
    //   this.selectedSocialGroups = [];
    //   this.selectedSocialGroups = [...event.value];
    // } else {
    //   // this.selectedSocialGroups.splice(this.selectedSocialGroups.indexOf(event.value), 1);
    // }
    this.ChildFormGroup.get('socialGroups').setValue(this.selectedSocialGroups);
    console.log(event);
  }
  
  show(): void {
    console.log(this.selectedSocialGroups)
  }

  onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
