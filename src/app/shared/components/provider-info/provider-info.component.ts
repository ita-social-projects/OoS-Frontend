import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Constants } from 'shared/constants/constants';
import { InstitutionTypesEnum, LicenseStatusEnum, OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { CreateProviderSteps, InstitutionTypes, OwnershipTypes } from 'shared/enum/provider';
import { Role } from 'shared/enum/role';
import { LicenseStatuses } from 'shared/enum/statuses';
import { DataItem } from 'shared/models/item.model';
import { Provider } from 'shared/models/provider.model';
import { ActivateEditMode } from 'shared/store/app.actions';
import { GetInstitutionStatuses } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-provider-info',
  templateUrl: './provider-info.component.html',
  styleUrls: ['./provider-info.component.scss']
})
export class ProviderInfoComponent implements OnInit, OnDestroy {
  @Input() public provider: Provider;
  @Input() public isProviderView: boolean;

  @Output() public tabChanged = new EventEmitter();
  @Output() public closeInfo = new EventEmitter();

  @Select(MetaDataState.institutionStatuses)
  public institutionStatuses$: Observable<DataItem[]>;
  @Select(RegistrationState.role)
  public role$: Observable<Role>;

  public readonly constants = Constants;
  public readonly ownershipTypes = OwnershipTypes;
  public readonly ownershipTypesEnum = OwnershipTypesEnum;
  public readonly institutionTypes = InstitutionTypes;
  public readonly institutionTypesEnum = InstitutionTypesEnum;
  public readonly licenseStatusEnum = LicenseStatusEnum;
  public readonly licenseStatuses = LicenseStatuses;
  public readonly Role = Role;

  public role: Role;
  public institutionStatusName: string;
  public editLink: string = CreateProviderSteps[0];
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetInstitutionStatuses());
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role) => (this.role = role));
    this.institutionStatuses$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe(
        (institutionStatuses: DataItem[]) =>
          (this.institutionStatusName = institutionStatuses.find((item: DataItem) => item.id === this.provider.institutionStatusId).name)
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
}
