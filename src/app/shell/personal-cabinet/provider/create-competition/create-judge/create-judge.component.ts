import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { NAME_REGEX, TEXT_REGEX } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
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
  @Input() public judges: Judge[];

  @Output() public passJudgeFormArray = new EventEmitter();

  public JudgeFormArray: FormArray = new FormArray([]);

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    if (this.judges?.length) {
      this.judges.forEach((judge: Judge) => this.onAddJudge(judge));
    }
    this.onAddJudge();
  }

  /**
   * This method add new FormGroup to the FormArray
   */
  public onAddJudge(judge?: Judge): void {
    const formGroup = this.createNewForm(judge);
    this.JudgeFormArray.controls.push(formGroup);
    // eslint-disable-next-line @typescript-eslint/dot-notation, dot-notation
    this.JudgeFormArray['_registerControl'](formGroup); // for preventing emitting value changes in edit mode on initial value set
    this.passJudgeFormArray.emit(this.JudgeFormArray);
  }

  /**
   * This method delete form from the FormArray by index
   * @param index number
   */
  public onDeleteForm(index: number): void {
    if (this.JudgeFormArray.controls.length <= 1) {
      return;
    }

    const judgeFormGroup: AbstractControl = this.JudgeFormArray.controls[index];
    const isPristine = judgeFormGroup.pristine;

    if (judgeFormGroup.status === 'VALID' || !isPristine) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.deleteJudge,
          property: ''
        }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => result && this.JudgeFormArray.removeAt(index));
    } else {
      this.JudgeFormArray.removeAt(index);
    }

    this.markFormAsDirtyOnUserInteraction();
  }

  /**
   * This method create new FormGroup
   * @param judge Judge
   */
  private createNewForm(judge?: Judge): FormGroup {
    const judgeFormGroup = this.fb.group({
      id: new FormControl(''),
      lastName: new FormControl('', defaultValidators),
      firstName: new FormControl('', defaultValidators),
      judgeInfo: new FormControl('', [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_300)
      ])
    });

    if (judge) {
      this.activateEditMode(judgeFormGroup, judge);
    }
    return judgeFormGroup;
  }

  /**
   * This method fills inputs with information of edited judges
   */
  private activateEditMode(judgeFormGroup: FormGroup, judge: Judge): void {
    judgeFormGroup.patchValue(judge, { emitEvent: false });
  }

  /**
   * This method makes JudgeFormArray dirty
   */
  private markFormAsDirtyOnUserInteraction(): void {
    if (!this.JudgeFormArray.dirty) {
      this.JudgeFormArray.markAsDirty({ onlySelf: true });
    }
  }
}
