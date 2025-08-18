import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
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
import { ImagesService } from 'shared/services/images/images.service';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-competition-card',
  templateUrl: './competition-card.component.html',
  styleUrls: ['./competition-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionCardComponent implements OnInit, OnDestroy {
  @Input() public isCabinet = false;
  @Input() public isHorizontalView = false;
  @Input() public isCreateForm = false;

  @Output() public deleteCompetition = new EventEmitter<CompetitionBaseCard>();

  @Select(RegistrationState.role)
  public Role$: Observable<Role>;

  public isImageBroken = false;

  public readonly OwnershipTypeEnum = OwnershipTypesEnum;
  public readonly RecruitmentStatusEnum = RecruitmentStatusEnum;
  public readonly Role = Role;
  public readonly Constants = Constants;
  public readonly CategoryIcons = CategoryIcons;
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly CompetitionStatus = CompetitionStatus;
  public readonly ModalConfirmationType = ModalConfirmationType;
  public competitionData: CompetitionProviderViewCard;

  public role: Role;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private imageService: ImagesService,
    private router: Router,
    private store: Store
  ) {}

  @Input() public set competition(competition: CompetitionProviderViewCard) {
    this.competitionData = competition;
  }

  public ngOnInit(): void {
    // this code is a stub, so when the logic appears on the backend, it will need to be removed
    this.competitionData.amountOfPendingApplications = 0;
    this.competitionData.unreadMessages = 0;

    this.Role$.pipe(takeUntil(this.destroy$))
      .pipe(filter((role: Role) => role === Role.parent))
      .subscribe((role: Role) => {
        this.role = role;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onImageError(): void {
    this.isImageBroken = true;
    this.competitionData._meta = this.imageService.getDefaultCoverImage();
  }

  public onKeydown(event: KeyboardEvent, action: () => void): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      action();
      event.preventDefault();
    }
  }

  public onEditKeydown(event: KeyboardEvent): void {
    this.onKeydown(event, () => this.onEdit());
  }

  public onEdit(): void {
    this.router.navigate(['/create-competition', this.competitionData.id]);
  }

  public onDeleteKeydown(event: KeyboardEvent): void {
    this.onKeydown(event, () => this.onDelete());
  }

  public onDelete(): void {
    this.deleteCompetition.emit(this.competitionData);
  }
}
