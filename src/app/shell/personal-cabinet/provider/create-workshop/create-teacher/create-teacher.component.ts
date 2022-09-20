import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  TeacherFormArray: UntypedFormArray = new UntypedFormArray([]);

  @Input() teachers: Teacher[];
  @Input() isRelease3: boolean;

  @Output() passTeacherFormArray = new EventEmitter();

  constructor(private fb: UntypedFormBuilder, private matDialog: MatDialog) { }

  ngOnInit(): void {
    if (this.teachers?.length) {
      this.teachers.forEach((teahcer: Teacher) => this.onAddTeacher(teahcer));
    }
  }

  /**
   * This method add new FormGroup to teh FormArray
   */
  onAddTeacher(teacher?: Teacher): void {
    const formGroup = this.createNewForm(teacher);
    this.TeacherFormArray.controls.push(formGroup);
    this.TeacherFormArray['_registerControl'](formGroup);//for preventing emitting value changes in edit mode on initial value set
    this.passTeacherFormArray.emit(this.TeacherFormArray);
  }

  /**
   * This method create new FormGroup
   * @param FormArray: array
   */
  private createNewForm(teacher?: Teacher): UntypedFormGroup {
    const teacherFormGroup = this.fb.group({
      id: new UntypedFormControl(''),
      coverImage: new UntypedFormControl(''),
      coverImageId: new UntypedFormControl(''),
      lastName: new UntypedFormControl('', [
        Validators.required, 
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1), 
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      firstName: new UntypedFormControl('', [
        Validators.required, 
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1), 
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      middleName: new UntypedFormControl('', [
        Validators.required, 
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1), 
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      gender: new UntypedFormControl('', Validators.required),
      dateOfBirth: new UntypedFormControl('', Validators.required),
      description: new UntypedFormControl('', [
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
  private activateEditMode(teacherFormGroup: UntypedFormGroup, teacher): void {
    teacherFormGroup.patchValue(teacher, { emitEvent: false });
    if (teacher.coverImageId) {
      teacherFormGroup.get('coverImageId').setValue([teacher.coverImageId], { emitEvent: false });
    }
  }

  /**
   * This method delete form from teh FormArray by index
   * @param index: number
   */
  onDeleteForm(index: number): void {
    const  teacherFormGroup: AbstractControl = this.TeacherFormArray.controls[index];
    const isPristine = teacherFormGroup.pristine;

    if(teacherFormGroup.status==="VALID" || !isPristine ){
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.deleteTeacher,
          property: ''  
        }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => 
      result && this.TeacherFormArray.removeAt(index));
    } else {
      this.TeacherFormArray.removeAt(index);
    }
  }
}
