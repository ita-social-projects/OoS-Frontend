import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { AddDirectionFormComponent } from './add-direction-form.component';

describe('AddDirectionFormComponent', () => {
  let component: AddDirectionFormComponent;
  let fixture: ComponentFixture<AddDirectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [
        AddDirectionFormComponent,
        MockValidationHintForInputComponent,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDirectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-validation-hint-for-input',
  template: ''
})

class MockValidationHintForInputComponent {
  @Input() type: string;
  @Input() invalid: boolean;
  @Input() minLength: boolean;
  @Input() minCharachters: number;
  @Input() forbiddenCharacter: string;
  @Input() isEmptyCheck: boolean;
}
