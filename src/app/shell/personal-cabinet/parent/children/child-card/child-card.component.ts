import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Child } from '../../../../../shared/models/child.model';
import { Constants } from '../../../../../shared/constants/constants';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {
  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  readonly constants = Constants;

  public childFullName: string;
  public childAge: string;

  @Input() child: Child;

  @Output() deleteChild = new EventEmitter<Child>();

  ngOnInit(): void {
    this.childFullName = Util.getFullName(this.child);
    this.childAge = Util.getChildAge(this.child);
  }

  onDelete(): void {
    this.deleteChild.emit(this.child);
  }

}
