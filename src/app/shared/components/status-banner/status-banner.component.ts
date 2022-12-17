import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApplicationIcons } from '../../enum/applications';
import { ProviderStatusDetails, ProviderStatusTitles, Statuses, StatusThemes } from '../../enum/statuses';
import { ProviderStatus } from '../../models/providerStatus.model';
import { RegistrationState } from '../../store/registration.state';

@Component({
  selector: 'app-status-banner',
  templateUrl: './status-banner.component.html',
  styleUrls: ['./status-banner.component.scss']
})
export class StatusBannerComponent implements OnInit, OnDestroy {
  private get HostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  @Input() editLink: string;

  @Select(RegistrationState.providerStatus)
  providerStatus$: Observable<ProviderStatus>;
  providerStatus: ProviderStatus;

  iconClasses: string;
  statusTitle: string;
  statusDetails: string;
  editLinkDisplayed: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.providerStatus$.pipe(takeUntil(this.destroy$)).subscribe((providerStatus: ProviderStatus) => {
      this.providerStatus = providerStatus;
      this.setBannerOptions();
    });
  }

  onClose(): void {
    this.HostElement.classList.add('hide');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
