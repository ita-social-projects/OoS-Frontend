import { Store } from '@ngxs/store';
import { Component, Input, OnInit } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Login } from 'src/app/shared/store/registration.actions';
import { Role } from 'src/app/shared/enum/role';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  @Input() workshop: Workshop;
  @Input() role: string;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  login(): void {
    !(this.role !== Role.unauthorized) && this.store.dispatch(new Login());
  }
}
