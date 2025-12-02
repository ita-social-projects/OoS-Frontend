import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ApplicationIcons } from 'shared/enum/applications';
import { ApplicationStatusDescription, ApplicationTitles } from 'shared/enum/enumUA/statuses';
import { ApplicationStatuses, UserStatuses } from 'shared/enum/statuses';
import { Application } from 'shared/models/application.model';
import { BlockedParent } from 'shared/models/block.model';
import { Provider } from 'shared/models/provider.model';
import { GetBlockedParents, OnClearBlockedParents } from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { RegistrationState } from 'shared/store/registration.state';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { UserWorkshopService } from 'shared/services/workshops/user-workshop/user-workshop.service';

@Component({
  selector: 'app-info-status',
  templateUrl: './info-status.component.html',
  styleUrls: ['./info-status.component.scss']
})
export class InfoStatusComponent implements OnInit, OnDestroy {
  @Input() public application: Application = null;

  @Select(ProviderState.blockedParent)
  public blockedParent$: Observable<BlockedParent>;

  public readonly ApplicationTitles = ApplicationTitles;
  public readonly ApplicationStatusDescription = ApplicationStatusDescription;
  public readonly ApplicationIcons = ApplicationIcons;
  public readonly InfoMenuType = InfoMenuType;

  public status: ApplicationStatuses | UserStatuses.Blocked;
  public reason: string;
  public competitiveSelectionDescription: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private workshopService: UserWorkshopService
  ) {}

  public ngOnInit(): void {
    this.status = this.application.isBlockedByProvider ? UserStatuses.Blocked : ApplicationStatuses[this.application.status];
    this.reason = !this.application.isBlockedByProvider && this.application.rejectionMessage;
    if (this.status === ApplicationStatuses.AcceptedForSelection) {
      this.workshopService
        .getWorkshopCompetitiveSelectionDescriptionById(this.application.workshopId)
        .subscribe((description) => (this.competitiveSelectionDescription = description));
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onGetBlockedParent(): void {
    if (this.application.isBlockedByProvider) {
      const providerId = this.store.selectSnapshot<Provider>(RegistrationState.provider).id;
      this.store.dispatch(new GetBlockedParents(providerId, this.application.parentId));
      this.blockedParent$
        .pipe(
          takeUntil(this.destroy$),
          filter((blockedParent: BlockedParent) => !!blockedParent)
        )
        .subscribe((blockedParent: BlockedParent) => (this.reason = blockedParent.reason));
    }
  }

  public onMenuClosed(): void {
    if (this.application.isBlockedByProvider) {
      this.store.dispatch(new OnClearBlockedParents());
    }
  }
}
