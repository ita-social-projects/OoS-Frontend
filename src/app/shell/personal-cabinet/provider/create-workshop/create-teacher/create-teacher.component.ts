import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants'
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';


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
    } else {
      this.onAddTeacher();
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
      lastName: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      middleName: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      dateOfBirth: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });

    if (teacher) {
      teacherFormGroup.patchValue(teacher, { emitEvent: false });
      teacher.avatarImageId && teacherFormGroup.addControl('avatarImageId', this.fb.control([teacher.avatarImageId]));
    }
    return teacherFormGroup;
  }

  /**
   * This method delete form from teh FormArray by index
   * @param index: number
   */
  onDeleteForm(index: number): void {
    const status: string = this.TeacherFormArray.controls[index].status;
    const isTouched: boolean = this.TeacherFormArray.controls[index].touched;

    if (status !== 'INVALID' || isTouched) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: '330px',
        data: {
          type: ModalConfirmationType.deleteTeacher,
          property: ''
        }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        result && this.TeacherFormArray.removeAt(index);
      });
    }
    else {
      this.TeacherFormArray.removeAt(index);
    }
  }

}
