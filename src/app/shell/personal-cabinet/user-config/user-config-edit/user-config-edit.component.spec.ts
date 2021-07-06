import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserConfigEditComponent } from './user-config-edit.component';
import { NgxsModule } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from 'src/app/shared/models/user.model';

describe('UserConfigEditComponent', () => {
  let component: UserConfigEditComponent;
  let fixture: ComponentFixture<UserConfigEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [UserConfigEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigEditComponent);
    component.user = {
      lastName: '',
      firstName: '',
      middleName: '',
      phoneNumber: ''
    } as User;
    component = fixture.componentInstance;
    component.userEditFormGroup = new FormGroup({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
