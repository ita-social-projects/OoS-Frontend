import { LicenseStatuses } from 'shared/enum/statuses';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CreateProviderSteps, InstitutionTypes, OwnershipTypes } from 'shared/enum/provider';
import { Provider } from 'shared/models/provider.model';
import { Select, Store } from '@ngxs/store';
import { MetaDataState } from 'shared/store/meta-data.state';
import { Observable, Subject } from 'rxjs';
import { GetInstitutionStatuses } from 'shared/store/meta-data.actions';
import { filter, takeUntil } from 'rxjs/operators';
import { InstitutionTypesEnum, LicenseStatusEnum, OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { Constants } from 'shared/constants/constants';
import { DataItem } from 'shared/models/item.model';

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

  public constructor(private store: Store) {}

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
    sessionStorage.setItem('editMode', 'true');
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
