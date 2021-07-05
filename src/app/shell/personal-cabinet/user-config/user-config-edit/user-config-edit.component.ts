import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { UpdateUser } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-user-config-edit',
  templateUrl: './user-config-edit.component.html',
  styleUrls: ['./user-config-edit.component.scss']
})
export class UserConfigEditComponent implements OnInit {

  @Select(RegistrationState.user)
  user$: Observable<User>;

  public userEditFormGroup: FormGroup;
  public hidePassword = true;
  public hideConfirmPassword = true;

  constructor( private fb: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.user$.subscribe((user: User) => {
      this.userEditFormGroup = this.fb.group({
        lastName: new FormControl(user.lastName, [Validators.required]),
        firstName: new FormControl(user.firstName, [Validators.required]),
        middleName: new FormControl(user.middleName),
        phoneNumber: new FormControl(user.phoneNumber, [Validators.required]),
        email: new FormControl(user.email, [Validators.required, Validators.email]),
        passwords: new FormGroup({
          password: new FormControl('', [Validators.minLength(6)]),
          confirmPassword: new FormControl('')
        })
      });
    });
  }

  onSubmit(): void {
    this.store.dispatch(new UpdateUser(this.userEditFormGroup.value));
  }
}
