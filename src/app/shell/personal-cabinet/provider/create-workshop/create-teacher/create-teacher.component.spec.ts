import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { CreateTeacherComponent } from './create-teacher.component';

describe('CreateTeacherComponent', () => {
  let component: CreateTeacherComponent;
  let fixture: ComponentFixture<CreateTeacherComponent>;
  let matDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, ReactiveFormsModule, MatIconModule, MatGridListModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [CreateTeacherComponent, MockTeacherFormComponent, MockImageFormControlComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeacherComponent);
    component = fixture.componentInstance;
    matDialog = TestBed.inject(MatDialog);
    component.TeacherFormArray = new FormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDeleteForm method', () => {
    let mockIndex: number;
    let dialogOpenSpy: jest.SpyInstance;
    let removeAtSpy: jest.SpyInstance;
    let markAsDirtySpy: jest.SpyInstance;

    beforeEach(() => {
      mockIndex = 0;
      dialogOpenSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ConfirmationModalWindowComponent>);
      removeAtSpy = jest.spyOn(component.TeacherFormArray, 'removeAt');
      markAsDirtySpy = jest.spyOn(component.TeacherFormArray, 'markAsDirty');
    });

    it('should open matDialog with correct parameters', () => {
      component.TeacherFormArray.push(new FormControl());
      const expectedDialogParameters = {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.deleteTeacher,
          property: ''
        }
      };

      component.onDeleteForm(mockIndex);

      expect(dialogOpenSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectedDialogParameters);
    });

    it('should remove correct form control depends on provided index on afterClosed', () => {
      component.TeacherFormArray.push(new FormControl());

      component.onDeleteForm(mockIndex);

      expect(removeAtSpy).toHaveBeenCalledWith(mockIndex);
    });

    it('should mark form array as dirty at the end of method execution', () => {
      component.TeacherFormArray.push(new FormControl());

      component.onDeleteForm(mockIndex);

      expect(markAsDirtySpy).toHaveBeenCalledWith({ onlySelf: true });
    });

    it('should remove form control at a given index and mark form array as dirty if teacherFormGroup is invalid or it is pristine', () => {
      component.TeacherFormArray.push(new FormControl());
      component.TeacherFormArray.controls.at(mockIndex).setErrors({ required: true });

      component.onDeleteForm(mockIndex);

      expect(removeAtSpy).toHaveBeenCalledWith(mockIndex);
      expect(markAsDirtySpy).toHaveBeenCalledWith({ onlySelf: true });
    });
  });
});

@Component({
  selector: 'app-teacher-form',
  template: ''
})
class MockTeacherFormComponent {
  @Input() TeacherFormGroup: FormGroup;
  @Input() teacherAmount: number;
  @Input() index: number;
  @Input() isImagesFeature: boolean;
}

@Component({
  selector: 'app-image-form-control',
  template: ''
})
class MockImageFormControlComponent {}
