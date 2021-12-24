import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AboutFormComponent } from './about-form.component';
import { Component, Input } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AboutFormComponent', () => {
  let component: AboutFormComponent;
  let fixture: ComponentFixture<AboutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      declarations: [ 
        AboutFormComponent, 
        MockValidationHintForInputComponent 
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutFormComponent);
    component = fixture.componentInstance;
    component.AboutFormGroup = new FormGroup({
      image: new FormControl(''),
      headerName: new FormControl(''),
      sectionName: new FormControl(''),
      description: new FormControl('')
    });
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
  @Input() forbiddenCharacter: string;
}