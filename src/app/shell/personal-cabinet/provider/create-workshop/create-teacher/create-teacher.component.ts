import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants'
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Constants } from 'src/app/shared/constants/constants';
@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss']
})
export class CreateTeacherComponent implements OnInit {
  TeacherFormArray: FormArray = new FormArray([]);

  @Input() teachers: Teacher[];
  @Input() isRelease2: boolean;

  @Output() passTeacherFormArray = new EventEmitter();

  constructor(private fb: FormBuilder, private matDialog: MatDialog) { }

  ngOnInit(): void {
    if (this.teachers?.length) {
      this.teachers.forEach((teahcer: Teacher) => this.onAddTeacher(teahcer));
    }
  }

  /**
   * This method add new FormGroup to teh FormArray
   */
  onAddTeacher(teacher?: Teacher): void {
    this.TeacherFormArray.push(this.createNewForm(teacher));
    this.passTeacherFormArray.emit(this.TeacherFormArray);
  }

  /**
   * This method create new FormGroup
   * @param FormArray: array
   */
  private createNewForm(teacher?: Teacher): FormGroup {
    const teacherFormGroup = this.fb.group({
      avatarImage: new FormControl(''),
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
        Validators.required, 
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1), 
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      dateOfBirth: new FormControl('', Validators.required),
      description: new FormControl('', [
        Validators.required, 
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_300)
      ]),
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
    teacherFormGroup.addControl('teacherId', this.fb.control(teacher.id));
    teacher.avatarImageId && teacherFormGroup.addControl('avatarImageId', this.fb.control([teacher.avatarImageId]));
  }

  /**
   * This method delete form from teh FormArray by index
   * @param index: number
   */
  onDeleteForm(index: number): void {
    const  teacherFormGroup: AbstractControl = this.TeacherFormArray.controls[index];

    if (teacherFormGroup.invalid || teacherFormGroup.touched) {
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

}
