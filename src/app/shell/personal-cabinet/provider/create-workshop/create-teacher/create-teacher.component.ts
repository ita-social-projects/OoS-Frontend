import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { MUST_CONTAIN_LETTERS, NAME_REGEX } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Teacher } from 'shared/models/teacher.model';

const defaultValidators = [
  Validators.required,
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss']
})
export class CreateTeacherComponent implements OnInit {
  @Input() public teachers: Teacher[];
  @Input() public isImagesFeature: boolean;

  @Output() public passTeacherFormArray = new EventEmitter();

  public TeacherFormArray: FormArray = new FormArray([]);

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    if (this.teachers?.length) {
      this.teachers.forEach((teacher: Teacher) => this.onAddTeacher(teacher));
    }
  }

  /**
   * This method add new FormGroup to the FormArray
   */
  public onAddTeacher(teacher?: Teacher): void {
    const formGroup = this.createNewForm(teacher);
    this.TeacherFormArray.controls.push(formGroup);
    // eslint-disable-next-line @typescript-eslint/dot-notation, dot-notation
    this.TeacherFormArray['_registerControl'](formGroup); // for preventing emitting value changes in edit mode on initial value set
    this.passTeacherFormArray.emit(this.TeacherFormArray);
    this.checkedCountOfTeacher();
  }

  /**
   * This method delete form from the FormArray by index
   * @param index number
   */
  public onDeleteForm(index: number): void {
    const teacherFormGroup: AbstractControl = this.TeacherFormArray.controls[index];
    const isPristine = teacherFormGroup.pristine;

    if (teacherFormGroup.status === 'VALID' || !isPristine) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.deleteTeacher,
          property: ''
        }
      });

      dialogRef
        .afterClosed()
        .pipe(filter(Boolean))
        .subscribe(() => {
          this.TeacherFormArray.removeAt(index);
          this.checkedCountOfTeacher();
        });
    } else {
      this.TeacherFormArray.removeAt(index);
    }

    this.checkedCountOfTeacher();
    this.markFormAsDirtyOnUserInteraction();
  }

  /**
   * This method create new FormGroup
   * @param teacher Teacher
   */
  private createNewForm(teacher?: Teacher): FormGroup {
    const teacherFormGroup = this.fb.group({
      id: new FormControl(''),
      coverImage: new FormControl(''),
      coverImageId: new FormControl(''),
      lastName: new FormControl('', defaultValidators),
      firstName: new FormControl('', defaultValidators),
      middleName: new FormControl('', [
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      gender: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_300),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      defaultTeacher: new FormControl(!this.TeacherFormArray.controls.length)
    });

    if (teacher) {
      this.activateEditMode(teacherFormGroup, teacher);
    }
    return teacherFormGroup;
  }

  /**
   * This method fills inputs with information of edited teachers
   */
  private activateEditMode(teacherFormGroup: FormGroup, teacher: Teacher): void {
    teacherFormGroup.patchValue(teacher, { emitEvent: false });
    if (teacher.coverImageId) {
      teacherFormGroup.get('coverImageId').setValue([teacher.coverImageId], { emitEvent: false });
    }
  }

  private checkedCountOfTeacher(): void {
    this.TeacherFormArray.controls.forEach((control) => {
      const defaultTeacherControl = control.get('defaultTeacher');
      if (this.TeacherFormArray.controls.length <= 1) {
        defaultTeacherControl.setValue(true);
        defaultTeacherControl.disable();
      } else {
        defaultTeacherControl.enable();
      }
    });
  }

  /**
   * This method makes TeacherFormArray dirty
   */
  private markFormAsDirtyOnUserInteraction(): void {
    if (!this.TeacherFormArray.dirty) {
      this.TeacherFormArray.markAsDirty({ onlySelf: true });
    }
  }
}
