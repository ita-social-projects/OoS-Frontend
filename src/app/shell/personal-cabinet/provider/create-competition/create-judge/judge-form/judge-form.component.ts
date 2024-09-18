import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { ValidationConstants } from 'shared/constants/validation';

@Component({
  selector: 'app-judge-form',
  templateUrl: './judge-form.component.html',
  styleUrls: ['./judge-form.component.scss']
})
export class JudgeFormComponent {
  @Input() public index: number;
  @Input() public JudgeFormGroup: AbstractControl;
  @Input() public judgeAmount: number;

  @Output() public deleteForm = new EventEmitter();

  public readonly validationConstants = ValidationConstants;

  constructor() {}

  public get JudgeForm(): FormGroup {
    return this.JudgeFormGroup as FormGroup;
  }

  public onDeleteJudge(): void {
    this.deleteForm.emit(this.index);
  }

  public onFocusOut(formControlName: string): void {
    if (this.JudgeFormGroup.get(formControlName).pristine && !this.JudgeFormGroup.get(formControlName).value) {
      this.JudgeFormGroup.get(formControlName).setValue(null);
    }
  }
}
