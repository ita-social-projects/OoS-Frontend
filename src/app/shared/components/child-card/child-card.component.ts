import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Child } from '../../models/child.model';
import { Workshop } from '../../models/workshop.model';
import { DeleteChildById } from '../../store/user.actions';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {

  @Input() child: Child;

  workshops: Workshop[];

  constructor(private store: Store) { }

  ngOnInit(): void { }

  onEdit(): void {
    console.log('I edit it!');//TODO: link the real Api when child creation will be fixed
  }

  onDelete(): void {
    this.store.dispatch(new DeleteChildById(this.child.id));
  }
}
