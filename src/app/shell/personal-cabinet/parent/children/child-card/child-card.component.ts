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
  @Input() public child: Child;

  @Output() public deleteChild = new EventEmitter<Child>();

  public readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly constants = Constants;
  public readonly YearDeclination = YearDeclination;

  public childFullName: string;

  public get childAge(): number {
    return Util.getChildAge(this.child);
  }

  public ngOnInit(): void {
    this.childFullName = Util.getFullName(this.child);
  }

  public onDelete(): void {
    this.deleteChild.emit(this.child);
  }
}
