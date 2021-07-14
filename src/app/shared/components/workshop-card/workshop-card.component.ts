import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  public below: string = 'below';
  public IsShowToolTip: boolean;

  @Input() workshop: Workshop;
  @Input() userRole: string;
  @Input() isMainPage: boolean;

  @Output() deleteWorkshop = new EventEmitter<Workshop>();

  status: string = 'approved'; //temporary

  constructor(private store: Store) { }

  ngOnInit(): void { 
    this.IsShowToolTip = this.workshop.title.length > 18;
  }

  onEdit(): void {
    console.log("I edit it")
  }

  onDelete(): void {
    this.deleteWorkshop.emit(this.workshop);
  }

  onLike(): void {
    console.log("I like it")
  }

  onChangeStatus(status): void {
    this.status = status;
  }
}
