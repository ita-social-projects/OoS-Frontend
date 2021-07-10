import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofAction } from '@ngxs/store';
import { SnackBarComponent } from '../shared/components/snack-bar/snack-bar.component';
import { ShowMessageBar } from '../shared/store/app.actions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private actions$: Actions, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.actions$.pipe(ofAction(ShowMessageBar)).subscribe((payload) => this.showSnackBar(payload.payload));
  }

  showSnackBar({ message, type }): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 5000,
      panelClass: type,
      data: { message, type },
    });
  }

}
