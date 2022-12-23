import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import {
  ProviderStatuses,
  ProviderStatusDetails,
  ProviderStatusTitles,
  UserStatusIcons,
  UserStatuses,
} from '../../enum/statuses';
import { ActivateEditMode } from '../../store/app.actions';

@Component({
  selector: 'app-status-banner',
  templateUrl: './provider-status-banner.component.html',
  styleUrls: ['./provider-status-banner.component.scss'],
})
export class ProviderStatusBannerComponent implements OnInit {
  readonly Statuses = ProviderStatuses;

  private get HostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  @Input() editLink: string;
  @Input() providerStatus: { status: ProviderStatuses; statusReason: string; isBlocked: boolean };

  iconClasses: string;
  statusTitle: string;
  statusDetails: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private elementRef: ElementRef<HTMLElement>, private store: Store) {}

  ngOnInit(): void {
    this.setBannerOptions();
  }

  onActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }

  onClose(): void {
    this.HostElement.classList.add('hide');
  }

  private setBannerOptions(): void {
    if (this.providerStatus.isBlocked) {
      this.iconClasses = `${UserStatusIcons.Blocked} status-icon`;
      this.statusTitle = UserStatuses.Blocked;
    } else {
      this.iconClasses = `${UserStatusIcons[this.providerStatus.status]} status-icon`;
      this.statusTitle = ProviderStatusTitles[this.providerStatus.status];
    }
    this.statusDetails = this.providerStatus.statusReason
      ? this.providerStatus.statusReason
      : ProviderStatusDetails[this.providerStatus.status];
    this.HostElement.classList.value = ProviderStatuses[this.providerStatus.status];
  }
}
