import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { Constants, ModeConstants } from 'shared/constants/constants';
import { ApplicationShowParams } from 'shared/enum/applications';
import { YearDeclination } from 'shared/enum/enumUA/declinations/declination';
import { Role } from 'shared/enum/role';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application } from 'shared/models/application.model';
import { BlockedParent } from 'shared/models/block.model';
import { Direction } from 'shared/models/category.model';
import { MetaDataState } from 'shared/store/meta-data.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})
export class ApplicationCardComponent implements OnInit, OnDestroy {
  readonly applicationStatuses = ApplicationStatuses;
  readonly constants: typeof Constants = Constants;
  readonly role = Role;
  readonly YearDeclination = YearDeclination;
  readonly ModeConstants = ModeConstants;
  readonly UNLIMITED_SEATS = Constants.WORKSHOP_UNLIMITED_SEATS;

  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;

  blockedParent: BlockedParent;
  childFullName: string;
  userIsAdmin: boolean;
  applicationParams: {
    status: string;
    show: ApplicationShowParams;
  } = {
    status: undefined,
    show: ApplicationShowParams.Unblocked
  };
  applicationDirections: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() isMobileView: boolean;
  @Input() application: Application;
  @Input() userRole: string;

  @Output() public leave = new EventEmitter();
  @Output() public approve = new EventEmitter();
  @Output() public acceptForSelection = new EventEmitter();
  @Output() public reject = new EventEmitter();
  @Output() public block = new EventEmitter();
  @Output() public unblock = new EventEmitter();
  @Output() public sendMessage = new EventEmitter();

  get isApproveBtnHidden(): boolean {
    return (
      this.application.status === ApplicationStatuses.Approved ||
      this.application.status === ApplicationStatuses.Completed ||
      this.application.status === ApplicationStatuses.StudyingForYears
    );
  }

  get childAge(): number {
    return Util.getChildAge(this.application.child);
  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setUserIsAdmin(): void {
    this.userIsAdmin = this.userRole === Role.ministryAdmin || this.userRole === Role.techAdmin;
  }
}
