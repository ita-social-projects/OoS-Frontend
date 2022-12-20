import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { ApplicationIcons } from '../../enum/applications';
import { ProviderStatusTitles, Statuses } from '../../enum/statuses';
import { ActivateEditMode } from '../../store/app.actions';

@Component({
  selector: 'app-status-banner',
  templateUrl: './provider-status-banner.component.html',
  styleUrls: ['./provider-status-banner.component.scss']
})
export class ProviderStatusBannerComponent implements OnInit {
  readonly Statuses = Statuses;

  private approvedStatusDetails =
    'Ваш заклад підтверджено адміністратором. Тепер ваш заклад буде видно іншим користувачам платформи і ви зможете редагувати інформацію про заклад.';

  private get HostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  @Input() editLink: string;
  @Input() providerStatus: { status: Statuses; statusReason: string };

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
    this.iconClasses = `${ApplicationIcons[this.providerStatus.status]} status-icon`;
    this.statusTitle = ProviderStatusTitles[this.providerStatus.status];
    this.statusDetails = this.providerStatus.statusReason ? this.providerStatus.statusReason : this.approvedStatusDetails;
    this.HostElement.classList.value = Statuses[this.providerStatus.status];
  }
}
