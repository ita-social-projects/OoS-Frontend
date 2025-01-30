import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil, filter } from 'rxjs';
import { Constants } from 'shared/constants/constants';
import { OwnershipTypesEnum, InstitutionTypesEnum, LicenseStatusEnum } from 'shared/enum/enumUA/provider';
import { OwnershipTypes, InstitutionTypes, CreateProviderSteps } from 'shared/enum/provider';
import { Role } from 'shared/enum/role';
import { LicenseStatuses } from 'shared/enum/statuses';
import { DataItem } from 'shared/models/item.model';
import { Workshop } from 'shared/models/workshop.model';
import { ActivateEditMode } from 'shared/store/app.actions';
import { GetInstitutionStatuses } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-workshop-info',
  templateUrl: './workshop-info.component.html',
  styleUrls: ['./workshop-info.component.scss']
})
export class WorkshopInfoComponent implements OnDestroy, OnInit {
  @Input() public workshop: Workshop;
  @Input() public isWorkshopView: boolean;

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
