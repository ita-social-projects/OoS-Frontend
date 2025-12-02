import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, filter, Observable, takeUntil } from 'rxjs';
import { Constants, WorkingDaysValues } from 'shared/constants/constants';
import { WorkingDays, WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { Role } from 'shared/enum/role';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';
import { Workshop } from 'shared/models/workshop.model';
import { MetaDataState } from 'shared/store/meta-data.state';
import { RegistrationState } from 'shared/store/registration.state';
import { CoverageEnum, FormOfLearningEnum, PayRateTypeEnum, SpecialNeedsTypeEnum } from 'shared/enum/enumUA/workshop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DeleteWorkshopDraftCoverImage, DeleteWorkshopDraftImage } from 'shared/store/shared-user.actions';
import { FeaturesList } from 'shared/models/features-list.model';
import { InstituitionHierarchy, Institution, InstitutionFieldDescription } from 'shared/models/institution.model';
import {
  GetAllInstitutions,
  GetFieldDescriptionByInstitutionId,
  GetInstitutionHierarchyParentsById,
  ResetInstitutionHierarchy
} from 'shared/store/meta-data.actions';
import { InfoListenerComponent } from '../../admin-shared/info-listener.component';

@Component({
  selector: 'app-workshop-info',
  templateUrl: './workshop-info.component.html',
  styleUrls: ['./workshop-info.component.scss']
})
export class WorkshopInfoComponent extends InfoListenerComponent implements OnInit, OnDestroy {
  @Input() public workshopDraftId: string;
  @Input() public isWorkshopView: boolean;

  @Output() public tabChanged = new EventEmitter();
  @Output() public closeInfo = new EventEmitter();

  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;
  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(MetaDataState.editInstituitionsHierarchy)
  private readonly editInstituitionsHierarchy$: Observable<InstituitionHierarchy[]>;
  @Select(MetaDataState.institutionFieldDesc)
  private readonly institutionFieldDesc$: Observable<InstitutionFieldDescription[]>;

  public readonly Role = Role;
  public readonly workingDays = WorkingDays;
  public readonly workingDaysReverse = WorkingDaysReverse;
  public readonly formOfLearningEnum = FormOfLearningEnum;
  public readonly unlimitedSeats = Constants.UNLIMITED_SEATS;
  public readonly specialNeedsType = SpecialNeedsTypeEnum;
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly coverageEnum = CoverageEnum;
  public workshop: Workshop;
  public role: Role;
  public isImagesFeature: boolean;
  public hierarchyElements: { filedTitle: string; title: string; hierarchyLevel: number }[] = [];
  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => ({ ...value }));
  public form: FormGroup;
  private pendingWorkshop: Workshop;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    protected readonly renderer: Renderer2
  ) {
    super(renderer);
  }

  @Input()
  public set setWorkshop(workshop: Workshop) {
    this.workshop = workshop;
    this.loadHierarchyElements();
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
    this.store.dispatch(new GetAllInstitutions(false));
    this.initListeners();
    if (this.pendingWorkshop) {
      this.applyWorkshopToForm(this.pendingWorkshop);
      this.pendingWorkshop = null;
    }
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new ResetInstitutionHierarchy());
    super.ngOnDestroy();
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
    this.featuresList$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((featuresList: FeaturesList) => (this.isImagesFeature = featuresList.images));
  }

  private loadHierarchyElements(): void {
    this.store.dispatch(new GetFieldDescriptionByInstitutionId(this.workshop.institutionId));
    this.store.dispatch(new GetInstitutionHierarchyParentsById(this.workshop.institutionHierarchyId));

    combineLatest([this.institutionFieldDesc$.pipe(filter(Boolean)), this.editInstituitionsHierarchy$.pipe(filter(Boolean))])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([descriptions, hierarchy]) => {
        const newHierarchyElements = hierarchy.map((hItem) => ({
          filedTitle: descriptions.find((desc) => desc.hierarchyLevel === hItem.hierarchyLevel)?.title ?? '',
          hierarchyLevel: hItem.hierarchyLevel,
          title: hItem.title
        }));

        this.hierarchyElements = newHierarchyElements.sort((a, b) => a.hierarchyLevel - b.hierarchyLevel);
      });

    this.institutions$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((institutions) => {
      this.workshop.institution = institutions.find((item) => item.id === this.workshop.institutionId)?.title || null;
    });
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
