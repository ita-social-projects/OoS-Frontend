import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApplicationIcons } from '../../../../../../shared/enum/applications';
import { Application } from '../../../../../../shared/models/application.model';
import { BlockedParent } from '../../../../../../shared/models/block.model';
import { Provider } from '../../../../../../shared/models/provider.model';
import { RegistrationState } from '../../../../../../shared/store/registration.state';
import { ProviderState } from '../../../../../../shared/store/provider.state';
import { GetBlockedParents, OnClearBlockedParents } from '../../../../../../shared/store/provider.actions';
import { ApplicationStatuses } from '../../../../../../shared/enum/statuses';
import { ApplicationStatusDescription, ApplicationTitles } from '../../../../../../shared/enum/enumUA/statuses';

@Component({
  selector: 'app-info-status',
  templateUrl: './info-status.component.html',
  styleUrls: ['./info-status.component.scss']
})
export class InfoStatusComponent implements OnInit, OnDestroy {
  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  readonly applicationIcons = ApplicationIcons;

  @Input() application: Application = null;

  @Select(ProviderState.blockedParent)
  blockedParent$: Observable<BlockedParent>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  status: ApplicationStatuses;
  reason: string;

  private readonly blockedStatus = 'Blocked';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.status = this.application.isBlocked ? this.blockedStatus : ApplicationStatuses[this.application.status];
    this.reason = !this.application.isBlocked && this.application.rejectionMessage;
  }

  onGetBlockedParent(): void {
    if (this.application.isBlocked) {
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

  onMenuClosed(): void {
    if (this.application.isBlocked) {
      this.store.dispatch(new OnClearBlockedParents());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
