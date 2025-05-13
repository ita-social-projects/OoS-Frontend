import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { filter, takeUntil } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { WorkshopDescriptionItem, WorkshopDraft } from 'shared/models/workshop.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { GetWorkshopDraftById } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/shared-cabinet/create-form/create-form.component';
import { InfoMenuType } from 'shared/enum/info-menu-type';

@Component({
  selector: 'app-moderator-draft-edit-form',
  templateUrl: './moderator-draft-edit-form.component.html',
  styleUrls: ['./moderator-draft-edit-form.component.scss']
})
export class ModeratorDraftEditFormComponent extends CreateFormComponent implements OnInit {
  @Select(SharedUserState.selectedWorkshop)
  public selectedWorkshop$: Observable<WorkshopDraft>;
  public selectedWorkshop: WorkshopDraft;
  public activatedRoute: ActivatedRoute;
  public form: FormGroup;
  public SectionItemsFormArray = new FormArray([]);
  public EditFormGroup: FormGroup;
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

    this.form = formBuilder.group({
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
      competitiveSelection: new FormControl(false),
      competitiveSelectionDescription: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      enrollmentProcedureDescription: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_2000)
      ]),
      imageFiles: new FormControl(''),
      imageIds: new FormControl(''),
      workshopDescriptionItems: this.SectionItemsFormArray
    });
  }

  public ngOnInit(): void {
    this.subscribeOnDirtyForm(this.form);
    this.determineRelease();
    this.determineEditMode();
    this.addNavPath();
    this.onCompetitiveSelectionInit();
  }

  public addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: 'Чернетки гуртків',
            path: '/admin-tools/data/workshop-list',
            isActive: false,
            disable: false
          },
          {
            name: NavBarName.ModerateWorkshop,
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

  public onSubmit(): void {}

  public onCancel(): void {
    this.router.navigate(['/admin-tools/data/workshop-list']);
  }

  public setEditMode(): void {
    this.store.dispatch(new GetWorkshopDraftById(this.activatedRoute.snapshot.paramMap.get('id')));

    this.selectedWorkshop$
      .pipe(
        filter((workshopDraft) => Boolean(workshopDraft)),
        takeUntil(this.destroy$)
      )
      .subscribe((workshopDraft) => {
        this.form.patchValue({
          coverImageId: [workshopDraft.workshopDetails.coverImageId],
          coverImage: workshopDraft.workshopDetails.coverImage,
          title: workshopDraft.workshopDetails.title,
          shortTitle: workshopDraft.workshopDetails.shortTitle,
          competitiveSelection: workshopDraft.workshopDetails.competitiveSelection,
          competitiveSelectionDescription: workshopDraft.workshopDetails.competitiveSelectionDescription,
          enrollmentProcedureDescription: workshopDraft.workshopDetails.enrollmentProcedureDescription
        });

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

        if (this.selectedWorkshop.competitiveSelection) {
          this.form.get('competitiveSelectionDescription')?.enable();
        }
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

  private onCompetitiveSelectionInit(): void {
    this.form
      .get('competitiveSelection')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        if (value) {
          this.form.get('competitiveSelectionDescription').enable();
        } else {
          this.form.get('competitiveSelectionDescription').markAsUntouched();
          this.form.get('competitiveSelectionDescription').disable();
        }
      });
  }
}
