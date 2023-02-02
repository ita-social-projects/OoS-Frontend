import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { ProviderStatusDetails, ProviderStatusTitles } from '../../enum/enumUA/statuses';
import {
  ProviderStatuses,
  UserStatusIcons,
  UserStatuses,
} from '../../enum/statuses';
import { Provider } from '../../models/provider.model';
import { ActivateEditMode } from '../../store/app.actions';

@Component({
  selector: 'app-provider-status-banner',
  templateUrl: './provider-status-banner.component.html',
  styleUrls: ['./provider-status-banner.component.scss'],
})
export class ProviderStatusBannerComponent implements OnInit {
  readonly statuses = ProviderStatuses;

  @Input() provider: Provider;

  private get HostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  editLink = '/create-provider/info';
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
    if (this.provider.isBlocked) {
      this.iconClasses = `${UserStatusIcons.Blocked} status-icon`;
      this.statusTitle = UserStatuses.Blocked;
    } else {
      this.iconClasses = `${UserStatusIcons[this.provider.status]} status-icon`;
      this.statusTitle = ProviderStatusTitles[this.provider.status];
    }
    this.statusDetails = this.provider.statusReason
      ? this.provider.statusReason
      : ProviderStatusDetails[this.provider.status];
    this.HostElement.classList.value = ProviderStatuses[this.provider.status];
  }
}
