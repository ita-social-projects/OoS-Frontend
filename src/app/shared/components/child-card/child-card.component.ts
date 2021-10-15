// import { Application } from 'src/app/shared/models/application.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../models/application.model';
import { Child } from '../../models/child.model';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent  implements OnInit {

  @Input() child: Child;
  @Input() applications:Array<Application>;
  @Output() deleteChild = new EventEmitter<Child>();


  ngOnInit(): void {}

  onDelete(): void {
    this.deleteChild.emit(this.child);
  }

}
