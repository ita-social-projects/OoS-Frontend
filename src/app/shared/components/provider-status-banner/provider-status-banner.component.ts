import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { isValidNumber, parsePhoneNumber } from 'libphonenumber-js';
import { Observable, Subject } from 'rxjs';

import { BannerMode } from 'shared/enum/bannerMode';
import { ProviderStatusDetails, ProviderStatusTitles } from 'shared/enum/enumUA/statuses';
import { ProviderStatuses, UserStatuses, UserStatusIcons } from 'shared/enum/statuses';
import { Provider } from 'shared/models/provider.model';
import { ActivateEditMode } from 'shared/store/app.actions';
import { OnDeleteUnfinishedCompetition, OnDeleteUnfinishedWorkshop } from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';

@Component({
  selector: 'app-provider-status-banner',
  templateUrl: './provider-status-banner.component.html',
  styleUrls: ['./provider-status-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderStatusBannerComponent implements OnInit, OnDestroy {
  @Input() public provider: Provider;
  @Input() public mode: BannerMode;
  public hasUnfinishedEntityData$: Observable<boolean>;
  public timeToLiveUnfinishedEntity$: Observable<string>;

  public readonly statuses = ProviderStatuses;
  public readonly bannerMode = BannerMode;

  public editLink = '/create-provider/info';
  public iconClasses: string;
  public statusTitle: string;
  public statusDetails: string;
  private destroy$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private translateService: TranslateService,
    private store: Store,
    private router: Router
  ) {}

  private get HostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  public ngOnInit(): void {
    this.setBannerOptions();
    if (this.mode === BannerMode.UnfinishedWorkshop) {
      this.hasUnfinishedEntityData$ = this.store.select(ProviderState.hasUnfinishedWorkshopData);
      this.timeToLiveUnfinishedEntity$ = this.store.select(ProviderState.getTimeToLiveUnfinishedWorkshop);
    } else if (this.mode === BannerMode.UnfinishedCompetition) {
      this.hasUnfinishedEntityData$ = this.store.select(ProviderState.hasUnfinishedCompetitionData);
      this.timeToLiveUnfinishedEntity$ = this.store.select(ProviderState.getTimeToLiveUnfinishedCompetition);
    }
  }

  public onActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }

  public onClose(): void {
    this.HostElement.classList.add('hide');
  }

  public continueDraft(): void {
    const entity = this.mode === BannerMode.UnfinishedWorkshop ? 'workshop' : 'competition';
    this.router.navigate([`/create/${entity}`, 'unfinished']);
  }

  public cancelDraft(): void {
    if (this.mode === BannerMode.UnfinishedWorkshop) {
      this.store.dispatch(new OnDeleteUnfinishedWorkshop());
    } else {
      this.store.dispatch(new OnDeleteUnfinishedCompetition());
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setBannerOptions(): void {
    if (this.mode === BannerMode.Status) {
      if (this.provider.isBlocked) {
        this.iconClasses = `${UserStatusIcons.Blocked} status-icon`;
        this.statusTitle = ProviderStatusTitles[UserStatuses.Blocked];
        this.statusDetails = this.provider.blockReason ? this.provider.blockReason : ProviderStatusDetails[UserStatuses.Blocked];
        this.HostElement.classList.value = ProviderStatuses[UserStatuses.Blocked];

        if (this.provider.blockPhoneNumber) {
          this.statusDetails += ` (${this.translateService.instant(ProviderStatusDetails.BlockedPhoneNumber)} `;
          this.statusDetails +=
            (isValidNumber(this.provider.blockPhoneNumber)
              ? parsePhoneNumber(this.provider.blockPhoneNumber).formatInternational()
              : this.provider.blockPhoneNumber) + ')';
        }
      } else {
        this.iconClasses = `${UserStatusIcons[this.provider.status]} status-icon`;
        this.statusTitle = ProviderStatusTitles[this.provider.status];
        this.statusDetails = this.provider.statusReason ? this.provider.statusReason : ProviderStatusDetails[this.provider.status];
        this.HostElement.classList.value = ProviderStatuses[this.provider.status];
      }
    }
  }
}
