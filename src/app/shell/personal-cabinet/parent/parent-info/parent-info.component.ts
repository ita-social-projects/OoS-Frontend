import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Child } from 'src/app/shared/models/child.model';
import { DeleteChildById, GetChildren } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-parent-info',
  templateUrl: './parent-info.component.html',
  styleUrls: ['./parent-info.component.scss']
})
export class ParentInfoComponent implements OnInit {

  @Select(UserState.children)
  children$: Observable<Child[]>;
  constructor(private store: Store, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new GetChildren());
  }

  onDelete(childId: number): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: 'Видалити дитину?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new DeleteChildById(childId));
      }
    });
  }

}
