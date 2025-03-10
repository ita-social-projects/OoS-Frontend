import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { MUST_CONTAIN_LETTERS, NAME_REGEX, TEXT_REGEX } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Judge } from 'shared/models/judge.model';

const defaultValidators = [
  Validators.required,
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];

@Component({
  selector: 'app-create-judge',
  templateUrl: './create-judge.component.html',
  styleUrls: ['./create-judge.component.scss']
})
export class CreateJudgeComponent implements OnInit {
  /**
   * @TODO return and refactor this code. If logic of judge changed completely, you can remove it
   */
  @Input() public chiefJudge: Judge;
  @Input() public judges: Judge[];

  @Output() public passJudgeFormArray = new EventEmitter();

  public JudgeFormArray: FormArray = new FormArray([]);

  // Delete when add feature for judges
  public noFeature = NoResultsTitle.noFeature;

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    // if (this.chiefJudge) {
    //   this.onAddJudge(this.chiefJudge);
    //   if (this.judges?.length) {
    //     this.judges.forEach((judge: Judge) => this.onAddJudge(judge));
    //   }
    //   this.markFormAsDirtyOnUserInteraction();
    // } else {
    //   this.onAddJudge();
    // }
  }

  // /**
  //  * This method add new FormGroup to the FormArray
  //  * When add feature for judges remove comments and add functionality that in comments
  //  */
  // public onAddJudge(judge?: Judge): void {
  //   // const formGroup = this.createNewForm(judge);
  //   // this.JudgeFormArray.controls.push(formGroup);
  //   // eslint-disable-next-line @typescript-eslint/dot-notation, dot-notation
  //   // this.JudgeFormArray['_registerControl'](formGroup); // for preventing emitting value changes in edit mode on initial value set
  //   this.passJudgeFormArray.emit(this.JudgeFormArray);
  //   this.checkedCountOfJudges();
  // }

  // /**
  //  * This method delete form from the FormArray by index
  //  * @param index number
  //  */
  // public onDeleteForm(index: number): void {
  //   const judgeFormGroup: AbstractControl = this.JudgeFormArray.controls[index];
  //   const isPristine = judgeFormGroup.pristine;

  //   if (judgeFormGroup.status === 'VALID' || !isPristine) {
  //     const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
  //       width: Constants.MODAL_SMALL,
  //       data: {
  //         type: ModalConfirmationType.deleteJudge,
  //         property: ''
  //       }
  //     });

  //     dialogRef
  //       .afterClosed()
  //       .pipe(filter(Boolean))
  //       .subscribe(() => {
  //         this.JudgeFormArray.removeAt(index);
  //         this.checkedCountOfJudges();
  //       });
  //   } else {
  //     this.JudgeFormArray.removeAt(index);
  //   }

  //   this.checkedCountOfJudges();
  //   this.markFormAsDirtyOnUserInteraction();
  // }

  /**
   * This method create new FormGroup
   * @param judge Judge
   * When add feature for judges remove comments and add functionality that in comments
   */
  // private createNewForm(judge?: Judge): FormGroup {
  //   const judgeFormGroup = this.fb.group({
  //     id: new FormControl(''),
  //     lastName: new FormControl('', defaultValidators),
  //     firstName: new FormControl('', defaultValidators),
  //     description: new FormControl('', [
  //       Validators.required,
  //       Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
  //       Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_300),
  //       Validators.pattern(MUST_CONTAIN_LETTERS)
  //     ]),
  //     coverImageId: new FormControl(''),
  //     middleName: new FormControl(''),
  //     dateOfBirth: new FormControl('', Validators.required),
  //     isChiefJudge: new FormControl(!this.JudgeFormArray.controls.length),
  //     gender: new FormControl('')
  //   });

  //   if (judge) {
  //     this.activateEditMode(judgeFormGroup, judge);
  //   }
  //   return judgeFormGroup;
  // }

  /**
   * This method fills inputs with information of edited judges
   * When add feature for judges remove comments and add functionality that in comments
   */
  // private activateEditMode(judgeFormGroup: FormGroup, judge: Judge): void {
  //   judgeFormGroup.patchValue(judge, { emitEvent: false });
  // }

  /**
   * This method makes JudgeFormArray dirty
   */
  // private markFormAsDirtyOnUserInteraction(): void {
  //   if (!this.JudgeFormArray.dirty) {
  //     this.JudgeFormArray.markAsDirty({ onlySelf: true });
  //   }
  // }

  // private checkedCountOfJudges(): void {
  //   this.JudgeFormArray.controls.forEach((control) => {
  //     const chiefJudgeControl = control.get('isChiefJudge');
  //     if (this.JudgeFormArray.controls.length <= 1) {
  //       chiefJudgeControl.setValue(true);
  //       chiefJudgeControl.disable();
  //     } else {
  //       chiefJudgeControl.enable();
  //     }
  //   });
  // }
}
