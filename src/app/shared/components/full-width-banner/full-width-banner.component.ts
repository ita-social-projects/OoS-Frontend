import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApplicationIcons } from '../../enum/applications';
import { ProviderStatusTitles, Statuses, StatusThemes } from '../../enum/statuses';
import { ProviderStatus } from '../../models/providerStatus.model';
import { RegistrationState } from '../../store/registration.state';

@Component({
  selector: 'app-full-width-banner',
  templateUrl: './full-width-banner.component.html',
  styleUrls: ['./full-width-banner.component.scss']
})
export class FullWidthBannerComponent implements OnInit {
  private get HostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  @Select(RegistrationState.providerStatus)
  providerStatus$: Observable<ProviderStatus>;
  providerStatus: ProviderStatus;

  iconClasses: string;
  statusTitle: string;
  isNeedEdit: boolean;
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

  private setBannerOptions(): void {
    this.iconClasses = `${ApplicationIcons[this.providerStatus.status]} status__icon`;
    this.statusTitle = ProviderStatusTitles[this.providerStatus.status];
    this.isNeedEdit = this.providerStatus.status !== Statuses.Approved;
    this.HostElement.classList.value = StatusThemes[this.providerStatus.status];
  }
}
