import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTeacherComponent } from './create-teacher.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('CreateTeacherComponent', () => {
  let component: CreateTeacherComponent;
  let fixture: ComponentFixture<CreateTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, ReactiveFormsModule, MatIconModule, MatGridListModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [CreateTeacherComponent, MockTeacherFormComponent, MockImageFormControlComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
  @Input() isRelease3: boolean;
}

@Component({
  selector: 'app-image-form-control',
  template: ''
})
class MockImageFormControlComponent {}
