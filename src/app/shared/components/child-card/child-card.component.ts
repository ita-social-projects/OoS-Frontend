import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../models/application.model';
import { Child } from '../../models/child.model';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {

  public below = 'below';
  public childFullName: string;

  @Input() child: Child;
  @Input() applications: Array<Application>;
  @Output() deleteChild = new EventEmitter<Child>();  

  ngOnInit(): void {
    this.childFullName =  `${this.child.lastName} ${this.child.firstName} ${this.child.middleName}`;
  }

  onDelete(): void {
    this.deleteChild.emit(this.child);
  }

}