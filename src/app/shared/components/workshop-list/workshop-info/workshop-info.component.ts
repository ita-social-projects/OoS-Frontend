import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Constants, WorkingDaysValues } from 'shared/constants/constants';
import { WorkingDays, WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { Role } from 'shared/enum/role';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';
import { Workshop } from 'shared/models/workshop.model';
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
  @Input() public workshop: Workshop;
  @Input() public workshopDraftId: string;
  @Input() public isWorkshopView: boolean;

  @Output() public tabChanged = new EventEmitter();
  @Output() public closeInfo = new EventEmitter();

  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(MetaDataState.codeficator)
  public workshopCodeficator$: Observable<Codeficator>;
  @Select(AdminState.direction)
  public workshopDirection$: Observable<Direction>;

  public readonly Role = Role;
  public readonly workingDays = WorkingDays;
  public readonly workingDaysReverse = WorkingDaysReverse;
  public readonly formOfLearningEnum = FormOfLearningEnum;
  public readonly unlimitedSeats = Constants.UNLIMITED_SEATS;
  public readonly specialNeedsType = SpecialNeedsTypeEnum;
  public readonly coverageEnum = CoverageEnum;

  public workshopDirection: Direction;
  public role: Role;

  public destroy$: Subject<boolean> = new Subject<boolean>();
  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => ({ ...value }));

  constructor(private readonly store: Store) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const newDirectionId = changes.workshop?.currentValue?.directionIds?.[0];
    if (newDirectionId) {
      this.store.dispatch(new GetDirectionById(newDirectionId));
    }
  }

  public ngOnInit(): void {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role) => (this.role = role));
    this.workshopDirection$.pipe(takeUntil(this.destroy$)).subscribe((direction) => (this.workshopDirection = direction));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onCloseInfo(): void {
    this.closeInfo.emit();
  }

  public hasSocialNetworks(): boolean {
    return (
      (Boolean(this.workshop.contacts?.length) && this.workshop.contacts?.some((contact) => contact.socialNetworks?.length > 0)) ?? false
    );
  }
}
