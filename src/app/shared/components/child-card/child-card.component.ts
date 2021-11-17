import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../models/application.model';
import { Child } from '../../models/child.model';
import { Util } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {

  public below = 'below';
  public childFullName: string;
  public childAge: string;

  @Input() child: Child;
  //@Input() application: Application;
  @Input() applications: Array<Application>;
  @Output() deleteChild = new EventEmitter<Child>();

  ngOnInit(): void {
    this.childFullName =  `${this.child.lastName} ${this.child.firstName} ${this.child.middleName}`;
    this.childAge = Util.getChildAge(this.child);
  }

  onDelete(): void {
    this.deleteChild.emit(this.child);
  }

}
