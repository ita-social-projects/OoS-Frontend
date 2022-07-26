import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../models/application.model';
import { Child } from '../../models/child.model';
import { Util } from 'src/app/shared/utils/utils';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {

  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public childFullName: string;
  public childAge: string;
  readonly constants: typeof Constants = Constants;

  @Input() child: Child;
  @Input() applications: Array<Application>;
  @Output() deleteChild = new EventEmitter<Child>();

  ngOnInit(): void {
    this.childFullName = `${this.child.lastName} ${this.child.firstName} ${this.child.middleName}`;
    this.childAge = Util.getChildAge(this.child);
  }

  onDelete(): void {
    this.deleteChild.emit(this.child);
  }

}
