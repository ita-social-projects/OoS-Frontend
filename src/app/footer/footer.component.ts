import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofAction } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageBarComponent } from '../shared/components/message-bar/message-bar.component';
import { ShowMessageBar } from '../shared/store/app.actions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private actions$: Actions, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.actions$.pipe(ofAction(ShowMessageBar))
      .pipe(
        takeUntil(this.destroy$))
      .subscribe((payload) => this.showSnackBar(payload.payload));
  }

  showSnackBar({ message, type }): void {
    this.snackBar.openFromComponent(MessageBarComponent, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: type,
      data: { message, type },
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
