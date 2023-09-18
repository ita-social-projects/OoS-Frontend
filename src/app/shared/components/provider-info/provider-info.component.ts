import { LicenseStatuses } from '../../enum/statuses';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CreateProviderSteps, InstitutionTypes, OwnershipTypes } from '../../enum/provider';
import { Provider } from '../../models/provider.model';
import { Select, Store } from '@ngxs/store';
import { MetaDataState } from '../../store/meta-data.state';
import { Observable, Subject } from 'rxjs';
import { GetInstitutionStatuses } from '../../store/meta-data.actions';
import { filter, takeUntil } from 'rxjs/operators';
import { InstitutionTypesEnum, LicenseStatusEnum, OwnershipTypesEnum } from '../../enum/enumUA/provider';
import { Constants } from '../../constants/constants';
import { ActivateEditMode } from '../../store/app.actions';
import { DataItem } from '../../models/item.model';

@Component({
  selector: 'app-provider-info',
  templateUrl: './provider-info.component.html',
  styleUrls: ['./provider-info.component.scss'],
})
export class ProviderInfoComponent implements OnInit, OnDestroy {
  readonly constants: typeof Constants = Constants;

  readonly ownershipTypes = OwnershipTypes;
  readonly ownershipTypesEnum = OwnershipTypesEnum;
  readonly institutionTypes = InstitutionTypes;
  readonly institutionTypesEnum = InstitutionTypesEnum;
  readonly licenseStatusEnum = LicenseStatusEnum;
  readonly licenseStatuses = LicenseStatuses;

  editLink: string = CreateProviderSteps[0];

  @Input() provider: Provider;
  @Input() isProviderView: boolean;

  @Output() tabChanged = new EventEmitter();
  @Output() closeInfo = new EventEmitter();

  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<DataItem[]>;
  institutionStatusName: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetInstitutionStatuses());
    this.institutionStatuses$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe(
        (institutionStatuses: DataItem[]) =>
          (this.institutionStatusName = institutionStatuses.find(
            (item: DataItem) => item.id === this.provider.institutionStatusId
          ).name)
      );
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.editLink = CreateProviderSteps[tabChangeEvent.index];
    this.tabChanged.emit(tabChangeEvent);
  }

  onCloseInfo(): void {
    this.closeInfo.emit();
  }

  onActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
