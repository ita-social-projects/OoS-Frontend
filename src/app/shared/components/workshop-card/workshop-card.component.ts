import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Role } from '../../enum/role';
import { User } from '../../models/user.model';
import { Workshop } from '../../models/workshop.model';
import { AppState } from '../../store/app.state';
import { RegistrationState } from '../../store/registration.state';
import { DeleteWorkshopById } from '../../store/user.actions';
@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnInit {

  readonly role: typeof Role = Role;

  @Input() workshop: Workshop;
  @Input() userRole: string;
  @Input() isMainPage: boolean;

  constructor(private store: Store) { }

  ngOnInit(): void { }

  onDelete(): void {
    this.store.dispatch(new DeleteWorkshopById(this.workshop.id));
  }

  onLike(): void {
    console.log("I like it")
  }

  onEdit(): void {
    console.log("I edit it")
  }
}
