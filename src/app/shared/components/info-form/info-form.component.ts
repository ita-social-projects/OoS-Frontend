import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ValidationConstants } from 'shared/constants/validation';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.scss']
})
export class InfoFormComponent {
  @Input() public index: number;
  @Input() public formAmount: number;
  @Input() public infoEditFormGroup: FormGroup;
  @Input() public maxDescriptionLength: number;

  @Output() public deleteForm = new EventEmitter();

  public readonly ValidationConstants = ValidationConstants;

  public onDelete(): void {
    this.deleteForm.emit(this.index);
  }

  public onFocusOut(formControlName: string): void {
    if (this.infoEditFormGroup.get(formControlName).pristine) {
      this.infoEditFormGroup.get(formControlName).setValue(null);
    }
  }
}
