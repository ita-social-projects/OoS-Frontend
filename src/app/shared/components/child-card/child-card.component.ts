import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() deleteChild = new EventEmitter<Child>();

  workshops: Workshop[];

  constructor(private store: Store) { }

  ngOnInit(): void { }

  onDelete(): void {
    this.deleteChild.emit(this.child);
  }
}
