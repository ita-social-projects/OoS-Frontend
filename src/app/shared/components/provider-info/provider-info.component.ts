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
  public readonly constants: typeof Constants = Constants;
  public readonly ownershipTypes = OwnershipTypes;
  public readonly ownershipTypesEnum = OwnershipTypesEnum;
  public readonly institutionTypes = InstitutionTypes;
  public readonly institutionTypesEnum = InstitutionTypesEnum;
  public readonly licenseStatusEnum = LicenseStatusEnum;
  public readonly licenseStatuses = LicenseStatuses;

  public editLink: string = CreateProviderSteps[0];

  @Input() public provider: Provider;
  @Input() public isProviderView: boolean;

  @Output() public tabChanged = new EventEmitter();
  @Output() public closeInfo = new EventEmitter();

  @Select(MetaDataState.institutionStatuses)
  public institutionStatuses$: Observable<DataItem[]>;
  public institutionStatusName: string;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  public ngOnInit(): void {
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

  public onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.editLink = CreateProviderSteps[tabChangeEvent.index];
    this.tabChanged.emit(tabChangeEvent);
  }

  public onCloseInfo(): void {
    this.closeInfo.emit();
  }

  public onActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
