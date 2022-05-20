import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { InfoEditComponent } from './info-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PlatformInfoEditComponent', () => {
  let component: InfoEditComponent;
  let fixture: ComponentFixture<InfoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ 
        InfoEditComponent,
        MockAboutFormComponent,
        MockValidationHintForInputComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-info-form',
  template: ''
})
class MockAboutFormComponent {
  @Input() AboutItemFormGroup: FormGroup;
  @Input() index: number;
  @Input() aboutFormAmount: number;
}
@Component({
  selector: 'app-validation-hint-for-input',
  template: ''
})
class MockValidationHintForInputComponent {
  @Input() type: string;
  @Input() invalid: boolean;
  @Input() forbiddenCharacter: string;
}