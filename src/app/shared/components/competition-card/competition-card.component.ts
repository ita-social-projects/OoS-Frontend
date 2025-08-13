import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { Constants } from 'shared/constants/constants';
import { CompetitionStatus } from 'shared/enum/competition';
import { OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { DraftStatusEnum, FormOfLearningEnum, PayRateTypeEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { CompetitionBaseCard, CompetitionDraftCard, CompetitionProviderViewCard } from 'shared/models/competition.model';
import { RegistrationState } from 'shared/store/registration.state';
import { ImagesService } from 'shared/services/images/images.service';
import { WorkshopDraftStatus } from 'shared/enum/workshop';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { CompetitionDraftSendForModeration, GetCompetitionDraftIdByCompetitionId } from 'shared/store/provider.actions';

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
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly CompetitionStatus = CompetitionStatus;
  public readonly ModalConfirmationType = ModalConfirmationType;
  public readonly draftStatusEnum = DraftStatusEnum;
  public readonly workshopDraftStatus = WorkshopDraftStatus;
  public competitionData: CompetitionProviderViewCard | CompetitionDraftCard;

  public role: Role;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private imageService: ImagesService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store
  ) {}

  @Input() public set competition(competition: CompetitionProviderViewCard | CompetitionDraftCard) {
    this.competitionData = competition;
  }

  public ngOnInit(): void {
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

  public onSendForModeration(id: string, type: ModalConfirmationType): void {
    const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: type
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.dispatch(new CompetitionDraftSendForModeration(id)));
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

  public onEdit(competitiveEventDraftId: string | undefined): void {
    if (competitiveEventDraftId) {
      this.router.navigate(['create/competition/draft', competitiveEventDraftId]);
    } else {
      this.store.dispatch(new GetCompetitionDraftIdByCompetitionId(this.competitionData?.id));
    }
  }

  public onDelete(): void {
    this.deleteCompetition.emit(this.competitionData);
  }

  protected readonly recruitmentStatusEnum = RecruitmentStatusEnum;
}
