import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { Constants } from 'shared/constants/constants';
import { ApplicationShowParams } from 'shared/enum/applications';
import { YearDeclination } from 'shared/enum/enumUA/declinations/declination';
import { Role } from 'shared/enum/role';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application } from 'shared/models/application.model';
import { BlockedParent } from 'shared/models/block.model';
import { Direction } from 'shared/models/category.model';
import { MetaDataState } from 'shared/store/meta-data.state';
import { Util } from 'shared/utils/utils';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { isRoleProvider } from 'shared/utils/provider.utils';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})
export class ApplicationCardComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.directions)
  public directions$: Observable<Direction[]>;

  @Input() public isMobileView: boolean;
  @Input() public application: Application;
  @Input() public userRole: string;

  @Output() public leave = new EventEmitter();
  @Output() public approve = new EventEmitter();
  @Output() public acceptForSelection = new EventEmitter();
  @Output() public reject = new EventEmitter();
  @Output() public block = new EventEmitter();
  @Output() public unblock = new EventEmitter();
  @Output() public sendMessage = new EventEmitter();

  public readonly ApplicationStatuses = ApplicationStatuses;
  public readonly Constants = Constants;
  public readonly Role = Role;
  public readonly YearDeclination = YearDeclination;
  public readonly InfoMenuType = InfoMenuType;
  public readonly isRoleProvider = isRoleProvider;

  public blockedParent: BlockedParent;
  public childFullName: string;
  public userIsAdmin: boolean;
  public applicationParams: {
    status: string;
    show: ApplicationShowParams;
  } = {
    status: undefined,
    show: ApplicationShowParams.Unblocked
  };
  public applicationDirections: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public get isApproveBtnHidden(): boolean {
    return [ApplicationStatuses.Approved, ApplicationStatuses.Completed, ApplicationStatuses.StudyingForYears].includes(
      this.application.status
    );
  }

  public get childAge(): number {
    return Util.getChildAge(this.application.child);
  }

  public ngOnInit(): void {
    this.childFullName = Util.getFullName(this.application.child);
    this.directions$
      .pipe(
        filter(Boolean),
        map((directions) =>
          directions
            .filter((direction) => this.application?.workshop.directionIds.includes(direction.id))
            .map((direction) => direction.title)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((directions) => (this.applicationDirections = directions.join(', ')));

    this.setUserIsAdmin();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setUserIsAdmin(): void {
    this.userIsAdmin = this.userRole === Role.ministryAdmin || this.userRole === Role.techAdmin;
  }
}
