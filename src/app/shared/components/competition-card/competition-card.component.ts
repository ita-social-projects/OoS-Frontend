import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { Constants } from 'shared/constants/constants';
import { CategoryIcons } from 'shared/enum/category-icons';
import { CompetitionStatus } from 'shared/enum/competition';
import { OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { FormOfLearningEnum, PayRateTypeEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { CompetitionBaseCard, CompetitionProviderViewCard } from 'shared/models/competition.model';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-competition-card',
  templateUrl: './competition-card.component.html',
  styleUrls: ['./competition-card.component.scss']
})
export class CompetitionCardComponent implements OnInit, OnDestroy {
  @Input() public isCabinetView = false;
  @Input() public isHorizontalView = false;
  @Input() public isCreateFormView = false;

  @Output() public deleteCompetition = new EventEmitter<CompetitionBaseCard>();

  @Select(RegistrationState.role)
  public role$: Observable<Role>;

  public readonly OwnershipTypeEnum = OwnershipTypesEnum;
  public readonly recruitmentStatusEnum = RecruitmentStatusEnum;
  public readonly Role = Role;
  public readonly tooltipPositionAbove = Constants.MAT_TOOL_TIP_POSITION_ABOVE;
  public readonly tooltipPositionBelow = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly categoryIcons = CategoryIcons;
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;
  public readonly workshopStatus = CompetitionStatus;
  public readonly modalConfirmationType = ModalConfirmationType;
  public competitionData: CompetitionProviderViewCard;

  public role: Role;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  @Input()
  public set competition(competition: CompetitionProviderViewCard) {
    this.competitionData = competition;
  }

  public ngOnInit(): void {
    // this code is a stub, so when the logic appears on the backend, it will need to be removed
    this.competitionData.amountOfPendingApplications = 0;
    this.competitionData.unreadMessages = 0;

    this.role$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter((role: Role) => role === Role.parent))
      .subscribe((role: Role) => {
        this.role = role;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onDelete(): void {
    this.deleteCompetition.emit(this.competitionData);
  }
}
