import { Store } from '@ngxs/store';
import { Component, Input, OnInit } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Login } from 'src/app/shared/store/registration.actions';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  @Input() workshop: Workshop;
  @Input() isRegistered: boolean;


  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  login(): void {
    !this.isRegistered && this.store.dispatch(new Login());
  }
}
