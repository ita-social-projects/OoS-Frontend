import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Constants, WorkingDaysValues } from 'shared/constants/constants';
import { OwnershipTypesEnum, InstitutionTypesEnum, LicenseStatusEnum } from 'shared/enum/enumUA/provider';
import { WorkingDays, WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { OwnershipTypes, InstitutionTypes, CreateProviderSteps } from 'shared/enum/provider';
import { Role } from 'shared/enum/role';
import { LicenseStatuses } from 'shared/enum/statuses';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';
import { WorkshopDraft } from 'shared/models/workshop.model';
import { GetCodeficatorById } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { RegistrationState } from 'shared/store/registration.state';
import { CoverageEnum, FormOfLearningEnum, SpecialNeedsTypeEnum } from 'shared/enum/enumUA/workshop';
import { GetDirectionById } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { Direction } from 'shared/models/category.model';
import { Codeficator } from 'shared/models/codeficator.model';

@Component({
  selector: 'app-workshop-info',
  templateUrl: './workshop-info.component.html',
  styleUrls: ['./workshop-info.component.scss']
})
export class WorkshopInfoComponent implements OnDestroy, OnInit, OnChanges {
  @Input() public workshop: WorkshopDraft;
  @Input() public isWorkshopView: boolean;

  @Output() public tabChanged = new EventEmitter();
  @Output() public closeInfo = new EventEmitter();

  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(MetaDataState.codeficator)
  public workshopCodeficator$: Observable<Codeficator>;
  @Select(AdminState.direction)
  public workshopDirection$: Observable<Direction>;

  public readonly constants = Constants;
  public readonly ownershipTypes = OwnershipTypes;
  public readonly ownershipTypesEnum = OwnershipTypesEnum;
  public readonly institutionTypes = InstitutionTypes;
  public readonly institutionTypesEnum = InstitutionTypesEnum;
  public readonly licenseStatusEnum = LicenseStatusEnum;
  public readonly licenseStatuses = LicenseStatuses;
  public readonly Role = Role;
  public readonly workingDays = WorkingDays;
  public readonly workingDaysReverse = WorkingDaysReverse;
  public readonly formOfLearningEnum = FormOfLearningEnum;
  public readonly unlimitedSeats = Constants.WORKSHOP_UNLIMITED_SEATS;
  public readonly specialNeedsType = SpecialNeedsTypeEnum;
  public readonly coverageEnum = CoverageEnum;

  public workshopDirection: Direction;
  public workshopCodeficator: Codeficator;
  public role: Role;
  public editLink: string = CreateProviderSteps[0];
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => ({ ...value }));

  constructor(private readonly store: Store) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const newDirectionId = changes.workshop?.currentValue?.directionIds?.[0];
    const catottgId = changes.workshop.currentValue?.address?.catottgId;
    if (catottgId) {
      this.store.dispatch(new GetCodeficatorById(catottgId));
    }
    if (newDirectionId) {
      this.store.dispatch(new GetDirectionById(newDirectionId));
    }
  }

  public ngOnInit(): void {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role) => (this.role = role));
    this.workshopCodeficator$.pipe(takeUntil(this.destroy$)).subscribe((codeficator) => (this.workshopCodeficator = codeficator));
    this.workshopDirection$.pipe(takeUntil(this.destroy$)).subscribe((direction) => (this.workshopDirection = direction));
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
}
