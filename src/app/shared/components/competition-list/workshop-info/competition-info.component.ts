import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DeleteWorkshopDraftCoverImage, DeleteWorkshopDraftImage } from 'shared/store/shared-user.actions';
import { FeaturesList } from 'shared/models/features-list.model';

@Component({
  selector: 'app-competition-info',
  templateUrl: './competition-info.component.html',
  styleUrls: ['./competition-info.component.scss']
})
export class WorkshopInfoComponent implements OnDestroy, OnInit {
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
  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;

  public readonly Role = Role;
  public readonly workingDays = WorkingDays;
  public readonly workingDaysReverse = WorkingDaysReverse;
  public readonly formOfLearningEnum = FormOfLearningEnum;
  public readonly unlimitedSeats = Constants.UNLIMITED_SEATS;
  public readonly specialNeedsType = SpecialNeedsTypeEnum;
  public readonly coverageEnum = CoverageEnum;
  public workshop: Workshop;
  public workshopDirection: Direction;
  public role: Role;
  public isImagesFeature: boolean;

  public destroy$: Subject<boolean> = new Subject<boolean>();
  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => ({ ...value }));
  public form: FormGroup;
  private pendingWorkshop: Workshop;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  @Input()
  public set setWorkshop(workshop: Workshop) {
    this.workshop = workshop;
    const newDirectionId = workshop?.directionIds?.[0];
    if (newDirectionId) {
      this.store.dispatch(new GetDirectionById(newDirectionId));
    }
    if (workshop) {
      if (this.form) {
        this.applyWorkshopToForm(workshop);
      } else {
        this.pendingWorkshop = workshop;
      }
    }
  }

  public ngOnInit(): void {
    this.initForm();
    this.initListeners();
    if (this.pendingWorkshop) {
      this.applyWorkshopToForm(this.pendingWorkshop);
      this.pendingWorkshop = null;
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onCloseInfo(): void {
    this.closeInfo.emit();
  }

  public onDeleteImage(imageId: string): void {
    this.store
      .dispatch(new DeleteWorkshopDraftImage(this.workshopDraftId, imageId))
      .pipe(
        filter((actionResult) => !actionResult.error),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const filesFormControl = this.form.get('imageFiles');
        const imageIdsFormControl = this.form.get('imageIds');

        const imageIds = [...imageIdsFormControl.value];
        const files = [...filesFormControl.value];

        const indexToDelete = imageIds.findIndex((value) => value === imageId);
        if (indexToDelete !== -1) {
          imageIds.splice(indexToDelete, 1);
          files.splice(indexToDelete, 1);
        }

        this.form.patchValue({
          imageFiles: files,
          imageIds: imageIds
        });
      });
  }

  public onDeleteCoverImage(): void {
    this.store
      .dispatch(new DeleteWorkshopDraftCoverImage(this.workshopDraftId))
      .pipe(
        filter((actionResult) => !actionResult.error),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const coverImageIdFormControl = this.form.get('coverImageId');
        const coverImageFormControl = this.form.get('coverImage');

        const ids = [...coverImageIdFormControl.value];
        const files = [...coverImageFormControl.value];

        ids.pop();
        files.pop();

        coverImageIdFormControl.setValue(ids);
        coverImageFormControl.setValue(files);
      });
  }

  public initForm(): void {
    this.form = this.fb.group({
      coverImageId: new FormControl(''),
      coverImage: new FormControl(''),
      imageFiles: new FormControl(''),
      imageIds: new FormControl('')
    });
  }

  public initListeners(): void {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role) => (this.role = role));
    this.workshopDirection$.pipe(takeUntil(this.destroy$)).subscribe((direction) => (this.workshopDirection = direction));
    this.featuresList$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((featuresList: FeaturesList) => (this.isImagesFeature = featuresList.images));
  }

  private applyWorkshopToForm(workshop: Workshop): void {
    if (workshop.coverImageId?.length) {
      this.form.get('coverImageId').setValue([workshop.coverImageId]);
    } else {
      this.form.get('coverImageId').setValue([]);
    }

    this.form.get('imageIds').setValue(workshop.imageIds);
  }
}
