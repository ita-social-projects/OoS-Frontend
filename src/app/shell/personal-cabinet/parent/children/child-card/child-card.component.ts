import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Constants } from 'shared/constants/constants';
import { YearDeclination } from 'shared/enum/enumUA/declinations/declination';
import { Child } from 'shared/models/child.model';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {
  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  readonly constants = Constants;
  readonly YearDeclination = YearDeclination;

  @Input() child: Child;

  @Output() deleteChild = new EventEmitter<Child>();

  public childFullName: string;

  get childAge(): number {
    return Util.getChildAge(this.child);
  }

  ngOnInit(): void {
    this.childFullName = Util.getFullName(this.child);
  }

  onDelete(): void {
    this.deleteChild.emit(this.child);
  }
}
