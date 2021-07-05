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
  user: User;

  public userEditFormGroup: FormGroup;
  public hidePassword = true;
  public hideConfirmPassword = true;

  constructor(private fb: FormBuilder, private store: Store) {
    this.userEditFormGroup = this.fb.group({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
    });

  }

  ngOnInit(): void {
    this.user$.subscribe((user: User) => this.user = user);
    this.userEditFormGroup.patchValue(this.user);
  }

  onSubmit(): void {
    const user = new User(this.userEditFormGroup.value, this.user.id)
    this.store.dispatch(new UpdateUser(user));
  }
}
