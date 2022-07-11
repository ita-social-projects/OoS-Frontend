import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
export class ChildFormComponent implements OnInit, OnChanges {
  readonly validationConstants = ValidationConstants;
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;

  @Input() ChildFormGroup: FormGroup;
  @Input() validationFormControl: FormControl = new FormControl();
  @Input() index: number;
  @Input() childrenAmount: number;
  @Input() socialGroups: SocialGroup[];
  @Input() isTouched: boolean;

  @Output() deleteForm = new EventEmitter();

  dateFilter: RegExp = DATE_REGEX;
  maxDate: Date = Util.getMaxBirthDate();
  minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  constructor() { }

  ngOnInit(): void { }

  onRemoveItem(item: string, control): void {
    let items = this.ChildFormGroup.controls[control].value;
    if (items.indexOf(item) >= 0) {
      items.splice(items.indexOf(item), 1);
      if (items.length !== 0) {
        this.ChildFormGroup.get(control).setValue([...items]);
      } else {
        this.ChildFormGroup.get(control).setValue(null);
      }
    }
  }

  checkGroupSelection(name?: string): any {
    let isDisabled = false
    if (this.ChildFormGroup.controls['socialGroupId'].value && this.ChildFormGroup.controls['socialGroupId'].value.length !== 0) {
      this.ChildFormGroup.controls['socialGroupId'].value.forEach(element => {
        if (element === 'Відсутня') {
          this.ChildFormGroup.controls['socialGroupId'].value.splice(1)
          isDisabled = true
        } else if (element === name) {
          isDisabled = true
        }
      })
    }
    return isDisabled
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.isTouched) {
      (<EventEmitter<any>>this.validationFormControl.statusChanges).emit();
    }
  }

  onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
