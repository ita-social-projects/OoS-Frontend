import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';

import { ValidationConstants } from 'shared/constants/validation';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-judge-form',
  templateUrl: './judge-form.component.html',
  styleUrls: ['./judge-form.component.scss']
})
export class JudgeFormComponent implements OnInit {
  /**
   * @TODO return this code when you need create judge functionality
   * and when you know what you should do with judges in competitions
   */
  // @Input() public index: number;
  // @Input() public JudgeFormGroup: AbstractControl;
  // @Input() public judgeAmount: number;

  // @Output() public deleteForm = new EventEmitter();

  // public readonly validationConstants = ValidationConstants;

  // public today: Date = new Date();
  // public minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  // private readonly defaultDebounceTime: number = 300;

  // constructor() {}

  // public get JudgeForm(): FormGroup {
  //   return this.JudgeFormGroup as FormGroup;
  // }

  public ngOnInit(): void {
    // this.JudgeForm.get('isChiefJudge')
    //   ?.valueChanges.pipe(debounceTime(this.defaultDebounceTime), filter(Boolean))
    //   .subscribe(() => {
    //     // take form array from create-judge component
    //     const parentArray = this.JudgeForm.parent as FormArray;
    //     if (parentArray) {
    //       parentArray.controls
    //         .filter((control) => control !== this.JudgeForm)
    //         .forEach((control) => {
    //           control.get('isChiefJudge')?.setValue(false, { emitEvent: false });
    //         });
    //     }
    //   });
  }

  // public onDeleteJudge(): void {
  //   this.deleteForm.emit(this.index);
  // }

  // public onFocusOut(formControlName: string): void {
  //   if (this.JudgeFormGroup.get(formControlName).pristine && !this.JudgeFormGroup.get(formControlName).value) {
  //     this.JudgeFormGroup.get(formControlName).setValue(null);
  //   }
  // }
}
