import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { asyncScheduler, forkJoin, Observable, of, zip } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import { Constants, ModeConstants } from 'shared/constants/constants';
import { NavBarName, PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { Role } from 'shared/enum/role';
import { Provider } from 'shared/models/provider.model';
import { Teacher } from 'shared/models/teacher.model';
import {
  AdditionalAbout,
  Contacts,
  UnfinishedWorkshopType as WorkshopTypeUnfinished,
  Workshop,
  WorkshopAbout,
  WorkshopDraft
} from 'shared/models/workshop.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import {
  CreateWorkshopDraft,
  GetUnfinishedWorkshop,
  OnSaveWorkshopStep,
  UpdateWorkshop,
  UpdateWorkshopDraft
} from 'shared/store/provider.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { GetWorkshopById, GetWorkshopDraftById, ResetProvider, ResetWorkshop } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { ShowMessageBar } from 'shared/store/app.actions';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { GetCodeficatorById } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { Codeficator } from 'shared/models/codeficator.model';
import { Address } from 'shared/models/address.model';
import { WorkshopType } from 'shared/enum/workshop';
import { Util } from 'shared/utils/utils';
import { MatDialog } from '@angular/material/dialog';
import { ProviderState } from 'shared/store/provider.state';
import { createUnfinishedAbout, createUnfinishedDescription, shouldBeDraft, submittingRealEntity } from 'shared/utils/provider.utils';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-workshop',
  templateUrl: './create-workshop.component.html',
  styleUrls: ['./create-workshop.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class CreateWorkshopComponent extends CreateFormComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('stepper') public stepper: MatStepper;
  @Select(RegistrationState.provider)
  public provider$: Observable<Provider>;
  @Select(SharedUserState.selectedWorkshop)
  public selectedWorkshop$: Observable<Workshop | WorkshopDraft>;
  @Select(MetaDataState.codeficator)
  public codeficator$: Observable<Codeficator>;
  @Select(ProviderState.unfinishedWorkshop)
  public unfinishedWorkshop$: Observable<Workshop>;
  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;
  public provider: Provider;
  public entity: string;
  public workshop: Workshop | WorkshopDraft;

  public AboutFormGroup: FormGroup;
  public DescriptionFormGroup: FormGroup;
  public AdditionalAboutGroup: FormGroup;
  public TeacherFormArray: FormArray;
  public WorkshopContactsFormArray: FormArray;

  protected readonly WorkshopType = WorkshopType;

  private readonly unfinishedWorkshopTypeMap = {
    1: WorkshopTypeUnfinished.WithMainProperties,
    2: WorkshopTypeUnfinished.WithOtherRequiredProperties,
    3: WorkshopTypeUnfinished.WithDescription,
    4: WorkshopTypeUnfinished.WithContacts
  };

  private readonly fieldsToCheck = [
    'title',
    'shortTitle',
    'coverImage',
    'imageFiles',
    'competitiveSelectionDescription',
    'workshopDescriptionItems',
    'keywords',
    'enrollmentProcedureDescription',
    'preferentialTermsOfParticipation'
  ];

  private readonly stepActions = {
    1: (): void => {
      this.createStepData(1)
        .pipe(takeUntil(this.destroy$))
        .subscribe((stepData) => this.dispatchUnfinishedData(1, stepData));
    },
    2: (): void => {
      this.createStepData(2)
        .pipe(takeUntil(this.destroy$))
        .subscribe((stepData) => this.dispatchUnfinishedData(2, stepData));
    },
    3: (): void => {
      this.createStepData(3)
        .pipe(takeUntil(this.destroy$))
        .subscribe((stepData) => this.dispatchUnfinishedData(3, stepData));
    },
    4: (): void => {
      this.createStepData(4)
        .pipe(takeUntil(this.destroy$))
        .subscribe((stepData) => this.dispatchUnfinishedData(4, stepData));
    }
  };

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {
    super(store, route, navigationBarService);
  }

  public get IsAllFormsNotDirtyAndInvalid(): boolean {
    return (
      (!this.AboutFormGroup.dirty &&
        !this.AdditionalAboutGroup.dirty &&
        !this.DescriptionFormGroup.dirty &&
        !this.WorkshopContactsFormArray.dirty) ||
      // && !this.TeacherFormArray?.dirty
      this.AboutFormGroup.invalid ||
      this.AdditionalAboutGroup.invalid ||
      this.DescriptionFormGroup.invalid ||
      this.WorkshopContactsFormArray.invalid
      // || this.TeacherFormArray?.invalid
    );
  }

  public get isUnfinished(): boolean {
    return this.getRouteParam() === ModeConstants.UNFINISHED;
  }

  public ngOnInit(): void {
    this.provider$.pipe(takeUntil(this.destroy$), filter(Boolean)).subscribe((provider: Provider) => (this.provider = provider));

    this.entity = this.route.snapshot.paramMap.get('entity') || WorkshopType.Workshop;

    this.determineEditMode();
    this.determineRelease();
    this.addNavPath();
  }

  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const personalCabinetTitle = PersonalCabinetTitle[userRole];
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/personal-cabinet/provider/workshops',
            isActive: false,
            disable: false
          },
          {
            name: this.editMode
              ? this.entity === WorkshopType.Workshop
                ? NavBarName.EditWorkshop
                : NavBarName.EditDraft
              : NavBarName.NewWorkshop,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  public setEditMode(): void {
    const param = this.getRouteParam();
    if (param === ModeConstants.UNFINISHED) {
      this.loadUnfinishedWorkshopData();
      this.editMode = false;
    } else {
      switch (this.entity) {
        case WorkshopType.Workshop:
          this.store.dispatch(new GetWorkshopById(param));
          break;
        case WorkshopType.Draft:
          this.store.dispatch(new GetWorkshopDraftById(param));
          break;
        default:
          this.editMode = false;
          return;
      }

      this.selectedWorkshop$.pipe(takeUntil(this.destroy$), filter(Boolean)).subscribe((workshop: Workshop | WorkshopDraft) => {
        this.workshop = Util.containsWorkshopOrCompetitionDetails(workshop) ? workshop.workshopDetails : workshop;
      });
    }
  }

  public saveUnfinishedData(formGroup: FormGroup | FormArray): void {
    if (formGroup.invalid) {
      return;
    }
    const param = this.getRouteParam();
    if (![ModeConstants.NEW, ModeConstants.UNFINISHED].includes(param)) {
      return;
    }

    const stepMappings = new Map<FormGroup | FormArray, number>([
      [this.AboutFormGroup, 1],
      [this.AdditionalAboutGroup, 2],
      [this.DescriptionFormGroup, 3],
      [this.WorkshopContactsFormArray, 4]
    ]);

    const step = stepMappings.get(formGroup) ?? -1;
    if (step !== -1) {
      this.stepActions[step]?.();
    }
  }

  public loadUnfinishedWorkshopData(): void {
    this.store.dispatch(new GetUnfinishedWorkshop());
    this.unfinishedWorkshop$.pipe(filter(Boolean), take(1)).subscribe((draft: Workshop) => {
      this.workshop = draft;
      asyncScheduler.schedule(() => {
        const stepToGo = this.getFirstInvalidStep();

        if (stepToGo !== -1 && this.stepper) {
          this.stepper.selectedIndex = stepToGo;
        }
      }, 1000);
    });
  }

  /**
   * This method dispatch store action to create a Workshop with Form Groups values
   */
  public onSubmit(): void | Observable<any> {
    const provider: Provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    const contacts = this.createContacts();
    const aboutInfo = this.createAbout();
    const additionalAboutInfo = this.createAdditionalAbout();
    const descInfo = this.DescriptionFormGroup.getRawValue();
    // const teachers = this.createTeachers();
    const teachers = [];

    if (teachers.length > 1 && !teachers.some((teacher) => teacher.defaultTeacher)) {
      return this.store.dispatch(new ShowMessageBar({ message: SnackbarText.errorDefaultTeacher, type: 'error' }));
    }

    let workshop: Workshop;

    if (this.editMode) {
      workshop = new Workshop(aboutInfo, descInfo, contacts, additionalAboutInfo, teachers, provider, this.workshop?.id);
      if (submittingRealEntity(this.entity)) {
        if (shouldBeDraft(this.workshop, workshop, this.fieldsToCheck)) {
          this.showDraftConfirmationDialog(workshop);
        } else {
          this.store.dispatch(new UpdateWorkshop(workshop));
        }
      } else {
        const draftId = this.getRouteParam();
        this.store.dispatch(new UpdateWorkshopDraft(draftId, workshop));
      }
    } else {
      workshop = new Workshop(aboutInfo, descInfo, contacts, additionalAboutInfo, teachers, provider);
      this.store.dispatch(new CreateWorkshopDraft(workshop));
    }
  }

  /**
   * This method receives an array of forms from create-teachers child component and assigns to the Teacher FormArray
   * @param array
   */
  public onReceiveTeacherFormArray(array: FormArray): void {
    this.TeacherFormArray = array;
    this.subscribeOnDirtyForm(array);
  }

  /**
   * This method receives a form from create-about child component and assigns to the About FormGroup
   * @param form
   */
  public onReceiveAboutFormGroup(form: FormGroup): void {
    this.AboutFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  public onReceiveWorkshopContactsFormArray(array: FormArray): void {
    this.WorkshopContactsFormArray = array;
    this.subscribeOnDirtyForm(array);
  }

  /**
   * This method receives a from create-description child component and assigns to the Description FormGroup
   * @param form
   */
  public onReceiveDescriptionFormGroup(form: FormGroup): void {
    this.DescriptionFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives a form from create-additional-about child component and assigns to the AdditionalAbout FormGroup
   * @param form
   */
  public onReceiveAdditionalAboutGroup(form: FormGroup): void {
    this.AdditionalAboutGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/workshops']);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch([new ResetProvider(), new ResetWorkshop()]);
  }

  private showDraftConfirmationDialog(workshop: Workshop): void {
    this.dialog
      .open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.draftEditSet
        }
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(new UpdateWorkshop(workshop));
      });
  }

  private dispatchUnfinishedData(step: number, data: any): void {
    this.store.dispatch(new OnSaveWorkshopStep({ data, step }));
  }

  private getFirstInvalidStep(): number {
    const steps = [
      this.AboutFormGroup,
      this.AdditionalAboutGroup,
      this.DescriptionFormGroup,
      this.WorkshopContactsFormArray
      // this.TeacherFormArray
    ];

    return steps.findIndex((step) => !step?.valid && !step?.touched);
  }

  private getRouteParam(): string {
    return this.route.snapshot.paramMap.get('param');
  }

  /**
   * Prepares 'About' section data from the form, setting 'availableSeats' to 'UNLIMITED_SEATS' if null.
   */
  private createAbout(): WorkshopAbout {
    const aboutInfo = this.AboutFormGroup.getRawValue();

    if (aboutInfo.studyPeriodDates) {
      if (aboutInfo.studyPeriodDates.startDate) {
        aboutInfo.studyPeriodDates.startDate = new Date(aboutInfo.studyPeriodDates.startDate).toISOString().split('T')[0];
      }

      if (aboutInfo.studyPeriodDates.endDate) {
        aboutInfo.studyPeriodDates.endDate = new Date(aboutInfo.studyPeriodDates.endDate).toISOString().split('T')[0];
      }
    }

    if (aboutInfo.availableSeats === null) {
      aboutInfo.availableSeats = this.UNLIMITED_SEATS;
    }

    return aboutInfo;
  }

  /**
   * Prepares 'AdditionalAbout' section data from the form, setting 'price' to 0 if null.
   */
  private createAdditionalAbout(): AdditionalAbout {
    const additionalInfo = this.AdditionalAboutGroup.getRawValue();

    additionalInfo.price = additionalInfo.price || 0;
    additionalInfo.isPaid = additionalInfo.price > 0;

    return additionalInfo;
  }

  /**
   * This method create array of teachers
   */
  private createTeachers(): Teacher[] {
    const teachers: Teacher[] = [];
    if (this.TeacherFormArray?.controls) {
      this.TeacherFormArray.controls.forEach((form: FormGroup) => {
        const teacher: Teacher = new Teacher(form.getRawValue());
        teachers.push(teacher);
      });
    }
    return teachers;
  }

  private createContacts(): Contacts[] {
    return this.WorkshopContactsFormArray?.controls.map((form: FormGroup) => new Contacts(form.value)) || [];
  }

  private createContactsWithCodeficator(): Observable<any[]> {
    const contacts = this.createContacts();

    if (!contacts.length) {
      return of([]);
    }

    const contactsToUpdate$ = contacts.map((contact) => {
      if (contact.address?.catottgId) {
        this.store.dispatch(new GetCodeficatorById(contact.address.catottgId));

        return this.codeficator$.pipe(
          filter((c) => c?.id === contact.address.catottgId),
          take(1),
          map((codeficatorData) => ({
            ...contact,
            address: new Address({
              ...contact.address,
              codeficatorAddress: codeficatorData
            })
          }))
        );
      }
      return of(contact);
    });

    return zip(...contactsToUpdate$);
  }

  private createStepData(step: number): Observable<any> {
    const baseData = {
      $type: this.unfinishedWorkshopTypeMap[step],
      providerId: this.provider.id
    };

    const about = this.createAbout();
    if (this.workshop?.base64CoverImage) {
      about.base64CoverImage = this.workshop.base64CoverImage;
    }
    const about$ = createUnfinishedAbout(about);
    const additional$ = of(this.createAdditionalAbout());
    const descriptionInfo = { ...this.AdditionalAboutGroup.getRawValue(), ...this.DescriptionFormGroup.getRawValue() };
    const description$ = createUnfinishedDescription(descriptionInfo);
    const contacts$ = this.createContactsWithCodeficator().pipe(map((contacts) => ({ contacts })));
    const stepConfig = new Map<number, Observable<any>[]>([
      [1, [about$]],
      [2, [about$, additional$]],
      [3, [about$, additional$, description$]],
      [4, [about$, additional$, description$, contacts$]]
    ]);

    const observables = stepConfig.get(step);

    if (!observables) {
      return of(baseData);
    }
    return forkJoin(observables).pipe(map((results) => ({ ...baseData, ...Object.assign({}, ...results) })));
  }
}
