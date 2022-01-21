import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SupportFormComponent } from './support-form.component';

describe('SupportFormComponent', () => {
  let component: SupportFormComponent;
  let fixture: ComponentFixture<SupportFormComponent>;

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
        SupportFormComponent, 
        MockValidationHintForInputComponent 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportFormComponent);
    component = fixture.componentInstance;
    component.SupportFormGroup = new FormGroup({
      image: new FormControl(''),
      title: new FormControl(''),
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