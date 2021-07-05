import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserConfigEditComponent } from './user-config-edit.component';
import { NgxsModule } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserConfigEditComponent', () => {
  let component: UserConfigEditComponent;
  let fixture: ComponentFixture<UserConfigEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        NgxsModule.forRoot([]),
        RouterTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [ UserConfigEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigEditComponent);
    component = fixture.componentInstance;
    component.userEditFormGroup = new FormGroup({
        lastName: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        middleName: new FormControl(''),
        phoneNumber: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        passwords: new FormGroup({
          password: new FormControl('', [Validators.minLength(6)]),
          confirmPassword: new FormControl('')
        })
      });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

