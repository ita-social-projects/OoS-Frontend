import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  ConfirmationModalWindowComponent
} from '../../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../../shared/constants/constants';
import { NAME_REGEX } from '../../../../../shared/constants/regex-constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { ModalConfirmationType } from '../../../../../shared/enum/modal-confirmation';
import { Teacher } from '../../../../../shared/models/teacher.model';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss']
})
export class CreateTeacherComponent implements OnInit {
  public TeacherFormArray: FormArray = new FormArray([]);

  @Input() public teachers: Teacher[];
  @Input() public isImagesFeature: boolean;

  @Output() public passTeacherFormArray = new EventEmitter();

  constructor(private fb: FormBuilder, private matDialog: MatDialog) {}

  public ngOnInit(): void {
    if (this.teachers?.length) {
      this.teachers.forEach((teahcer: Teacher) => this.onAddTeacher(teahcer));
    }
  }

  /**
   * This method add new FormGroup to the FormArray
   */
  public onAddTeacher(teacher?: Teacher): void {
    const formGroup = this.createNewForm(teacher);
    this.TeacherFormArray.controls.push(formGroup);
    this.TeacherFormArray['_registerControl'](formGroup); // for preventing emitting value changes in edit mode on initial value set
    this.passTeacherFormArray.emit(this.TeacherFormArray);
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

      dialogRef.afterClosed().subscribe((result: boolean) => result && this.TeacherFormArray.removeAt(index));
    } else {
      this.TeacherFormArray.removeAt(index);
    }
  }

  /**
   * This method create new FormGroup
   * @param FormArray: array
   */
  private createNewForm(teacher?: Teacher): FormGroup {
    const teacherFormGroup = this.fb.group({
      id: new FormControl(''),
      coverImage: new FormControl(''),
      coverImageId: new FormControl(''),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
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
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_300)
      ])
    });

    if (teacher) {
      this.activateEditMode(teacherFormGroup, teacher);
    }
    return teacherFormGroup;
  }

  /**
   * This method fills inputs with information of edited teachers
   */
  private activateEditMode(teacherFormGroup: FormGroup, teacher): void {
    teacherFormGroup.patchValue(teacher, { emitEvent: false });
    if (teacher.coverImageId) {
      teacherFormGroup.get('coverImageId').setValue([teacher.coverImageId], { emitEvent: false });
    }
  }
}
