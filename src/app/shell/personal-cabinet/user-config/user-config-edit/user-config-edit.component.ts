import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Parent } from 'src/app/shared/models/parent.model';
import { User } from 'src/app/shared/models/user.model';
import { ParentService } from 'src/app/shared/services/parent/parent.service';
import { RegistrationState } from 'src/app/shared/store/registration.state';

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

  constructor(
    private fb: FormBuilder,
    private parentService: ParentService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.user$.subscribe(user => {
      this.user = user;
      this.userEditFormGroup = this.fb.group({
        lastName: new FormControl(user.lastName, [Validators.required]),
        firstName: new FormControl(user.firstName, [Validators.required]),
        middleName: new FormControl(user.middleName),
        phone: new FormControl(user.phoneNumber, [Validators.required]),
        email: new FormControl(user.email, [Validators.required, Validators.email]),
        passwords: new FormGroup({
          password: new FormControl('', [Validators.minLength(6)]),
          confirmPassword: new FormControl('')
        })
      });
    });
  }

  public save(): void {
    const updatedParent = new Parent({
      userId: this.user.id,
      lastName: this.userEditFormGroup.get('lastName').value,
      firstName: this.userEditFormGroup.get('firstName').value,
      secondName: this.userEditFormGroup.get('middleName').value,

      /* TODO: uncomment when the backend is ready
      phone: this.userEditFormGroup.get('phone').value,
      email: this.userEditFormGroup.get('email').value,
      password: this.userEditFormGroup.get('passwords.password').value,
      confirmPassword: this.userEditFormGroup.get('passwords.confirmPassword').value*/
    });
    this.parentService.updateParent(updatedParent)
      .pipe(finalize(() => {
        this.router.navigate(['/personal-cabinet/config']);
      })).subscribe();
  }
}
