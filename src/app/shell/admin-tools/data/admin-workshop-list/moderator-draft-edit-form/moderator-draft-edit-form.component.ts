import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { Select, Store } from '@ngxs/store';
import { filter, takeUntil } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { WorkshopDescriptionItem, WorkshopDraft } from 'shared/models/workshop.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import {
  DeleteWorkshopDraftCoverImage,
  DeleteWorkshopDraftImage,
  EditWorkshopDraftByModerator,
  GetWorkshopDraftById,
  ResetWorkshop
} from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { RegistrationState } from 'shared/store/registration.state';
import { User } from 'shared/models/user.model';
import { CreateFormComponent } from '../../../../personal-cabinet/shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-moderator-draft-edit-form',
  templateUrl: './moderator-draft-edit-form.component.html',
  styleUrls: ['./moderator-draft-edit-form.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class ModeratorDraftEditFormComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(SharedUserState.selectedWorkshop)
  public selectedWorkshop$: Observable<WorkshopDraft>;
  @Select(RegistrationState.user)
  public currentUser$: Observable<User>;

  @ViewChild('stepper') public stepper: MatStepper;
  public selectedWorkshop: WorkshopDraft;
  public currentUser: User;
  public activatedRoute: ActivatedRoute;
  public form: FormGroup;
  public SectionItemsFormArray = new FormArray([]);
  public EditFormGroup: FormGroup;
  public WorkshopContactsFormArray: FormArray = new FormArray([]);
  public readonly validationConstants = ValidationConstants;
  public readonly InfoMenuType = InfoMenuType;

  constructor(
    activatedRoute: ActivatedRoute,
    navBarService: NavigationBarService,
    store: Store,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    super(store, activatedRoute, navBarService);
    this.activatedRoute = activatedRoute;
  }

  public ngOnInit(): void {
    this.initForm();
    this.subscribeOnDirtyForm(this.form);
    this.determineRelease();
    this.determineEditMode();
    this.addNavPath();
  }

  public addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.WorkshopDrafts,
            path: '/admin-tools/data/workshop-list',
            isActive: false,
            disable: false
          },
          {
            name: NavBarName.EditWorkshop,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  public onDeleteForm(index: number): void {
    this.SectionItemsFormArray.removeAt(index);
    this.markFormAsDirtyOnUserInteraction();
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  public onAddForm(): void {
    if (this.form.get('workshopDescriptionItems')) {
      (this.form.get('workshopDescriptionItems') as FormArray).push(this.newForm());
    }
  }

  public onNext(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.stepper.next();
    }
  }

  public onSubmit(): void {
    if (this.form.invalid || this.WorkshopContactsFormArray.invalid) {
      this.form.markAllAsTouched();
      this.WorkshopContactsFormArray.markAllAsTouched();
      return;
    }

    const formData = this.form.getRawValue();
    formData.workshopDescriptionItems = this.SectionItemsFormArray.getRawValue();
    formData.contacts = this.WorkshopContactsFormArray.getRawValue();
    this.store.dispatch(new EditWorkshopDraftByModerator(formData, this.selectedWorkshop.workshopDraftId));
  }

  public onCancel(): void {
    this.router.navigate(['/admin-tools/data/workshop-list']);
  }

  public setEditMode(): void {
    this.store.dispatch(new GetWorkshopDraftById(this.activatedRoute.snapshot.paramMap.get('id')));

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((currentUser) => {
      this.currentUser = currentUser;
    });

    this.selectedWorkshop$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((workshopDraft) => {
      this.form.patchValue(workshopDraft.workshopDetails);

      if (workshopDraft.workshopDetails.coverImageId) {
        this.form.get('coverImageId').setValue([workshopDraft.workshopDetails.coverImageId], { emitEvent: false });
      }

      if (workshopDraft.workshopDetails.imageIds?.length) {
        this.form.get('imageIds').setValue([...workshopDraft.workshopDetails.imageIds], { emitEvent: false });
      }

      this.selectedWorkshop = workshopDraft;

      if (this.selectedWorkshop.workshopDetails.workshopDescriptionItems?.length) {
        this.SectionItemsFormArray = new FormArray([]);
        this.selectedWorkshop.workshopDetails.workshopDescriptionItems.forEach((item: WorkshopDescriptionItem) => {
          const itemFrom = this.newForm(item);
          this.SectionItemsFormArray.controls.push(itemFrom);
          // eslint-disable-next-line dot-notation, @typescript-eslint/dot-notation
          this.SectionItemsFormArray['_registerControl'](itemFrom);
        });
      } else {
        this.onAddForm();
      }
    });
  }

  public onDeleteImage(imageId: string): void {
    this.store
      .dispatch(new DeleteWorkshopDraftImage(this.selectedWorkshop.workshopDraftId, imageId))
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
      .dispatch(new DeleteWorkshopDraftCoverImage(this.selectedWorkshop.workshopDraftId))
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

  public onReceiveWorkshopContactsFormArray(array: FormArray): void {
    this.WorkshopContactsFormArray = array;
    this.subscribeOnDirtyForm(array);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(new ResetWorkshop());
  }

  public initForm(): void {
    this.form = this.formBuilder.group({
      coverImageId: new FormControl(''),
      coverImage: new FormControl(''),
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      shortTitle: new FormControl('', [
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
        Validators.required,
        Validators.pattern(MUST_CONTAIN_LETTERS),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1)
      ]),
      competitiveSelectionDescription: new FormControl('', [Validators.pattern(MUST_CONTAIN_LETTERS)]),
      enrollmentProcedureDescription: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_2000)
      ]),
      imageFiles: new FormControl(''),
      imageIds: new FormControl(''),
      workshopDescriptionItems: this.SectionItemsFormArray,
      preferentialTermsOfParticipation: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_500)
      ]),
      institutionHierarchyId: new FormControl(''),
      institutionId: new FormControl('')
    });
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(item?: WorkshopDescriptionItem): FormGroup {
    this.EditFormGroup = this.formBuilder.group({
      sectionName: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_100),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ])
    });

    if (this.selectedWorkshop) {
      this.EditFormGroup.addControl('workshopId', this.formBuilder.control(this.selectedWorkshop.workshopDraftId));
    }

    if (item) {
      this.EditFormGroup.patchValue(item, { emitEvent: false });
    }

    return this.EditFormGroup;
  }

  /**
   * This method makes DescriptionFormGroup dirty
   */
  private markFormAsDirtyOnUserInteraction(): void {
    if (!this.form.dirty) {
      this.form.markAsDirty({ onlySelf: true });
    }
  }
}
