import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { environment } from 'src/environments/environment';
import { EditModalComponent } from './edit-modal/edit-modal.component';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {

  @Select(RegistrationState.user)
  user$: Observable<User>;
  authServer: string;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.authServer = environment.stsServer;
  }

  openDialogWindow():void{
    const dialogRef = this.dialog.open(EditModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }
}
