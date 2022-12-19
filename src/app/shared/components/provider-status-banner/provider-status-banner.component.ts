import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { ApplicationIcons } from '../../enum/applications';
import { ProviderStatusDetails, ProviderStatusTitles, Statuses, StatusThemes } from '../../enum/statuses';
import { ProviderStatus } from '../../models/providerStatus.model';
import { ActivateEditMode } from '../../store/app.actions';

@Component({
  selector: 'app-status-banner',
  templateUrl: './provider-status-banner.component.html',
  styleUrls: ['./provider-status-banner.component.scss']
})
export class ProviderStatusBannerComponent implements OnInit {
  private get HostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  @Input() editLink: string;
  @Input() providerStatus: ProviderStatus;

  iconClasses: string;
  statusTitle: string;
  statusDetails: string;
  editLinkDisplayed: boolean;
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
    this.iconClasses = `${ApplicationIcons[this.providerStatus.status]} status__icon`;
    this.statusTitle = ProviderStatusTitles[this.providerStatus.status];
    this.statusDetails = this.providerStatus.statusReason
      ? this.providerStatus.statusReason
      : ProviderStatusDetails[this.providerStatus.status];
    this.editLinkDisplayed = this.providerStatus.status === Statuses.Editing;
    this.HostElement.classList.value = StatusThemes[this.providerStatus.status];
  }
}
