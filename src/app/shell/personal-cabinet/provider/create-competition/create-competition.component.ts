import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { asyncScheduler, forkJoin, Observable, of, zip } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import { NavBarName, PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { Role } from 'shared/enum/role';
import {
  Competition,
  CompetitionDraft,
  CompetitionRequired,
  Description,
  UnfinishedCompetitionType
} from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { GetCompetitionById, GetCompetitionDraftById, ResetCompetition } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { Judge } from 'shared/models/judge.model';
import { Constants, ModeConstants } from 'shared/constants/constants';
import {
  CreateCompetition,
  GetUnfinishedCompetition,
  OnSaveCompetitionStep,
  UpdateCompetition,
  UpdateCompetitionDraft
} from 'shared/store/provider.actions';
import { Contacts } from 'shared/models/workshop.model';
import { Subdirection } from 'shared/models/category.model';
import { WorkshopType } from 'shared/enum/workshop';
import { Util } from 'shared/utils/utils';
import { createUnfinishedAbout, createUnfinishedDescription, shouldBeDraft, submittingRealEntity } from 'shared/utils/provider.utils';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { GetCodeficatorById } from 'shared/store/meta-data.actions';
import { Address } from 'shared/models/address.model';
import { MetaDataState } from 'shared/store/meta-data.state';
import { Codeficator } from 'shared/models/codeficator.model';
import { MatStepper } from '@angular/material/stepper';
import { ProviderState } from 'shared/store/provider.state';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-competition',
  templateUrl: './create-competition.component.html',
  styleUrls: ['./create-competition.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class CreateCompetitionComponent extends CreateFormComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('stepper') public stepper: MatStepper;
  @Select(MetaDataState.codeficator)
  public codeficator$: Observable<Codeficator>;
  @Select(RegistrationState.provider)
  private provider$: Observable<Provider>;
  @Select(SharedUserState.selectedCompetition)
  private selectedCompetition$: Observable<Competition>;
  @Select(ProviderState.unfinishedCompetition)
  private unfinishedCompetition$: Observable<Competition>;

  public provider: Provider;
  public competition: Competition;
  public parentCompetition: string;
  public entity: string;

  public RequiredFormGroup: FormGroup;
  public DescriptionFormGroup: FormGroup;
  public ContactsFormArray: FormArray;
  public JudgeFormArray: FormArray;

  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;
  public readonly WorkshopType = WorkshopType;

  private readonly unfinishedCompetitionTypeMap = {
    1: UnfinishedCompetitionType.WithAboutProperties,
    2: UnfinishedCompetitionType.WithDescription,
    3: UnfinishedCompetitionType.WithContacts
  };

  private param: string;
  private readonly fieldsToCheck = [
    'title',
    'shortTitle',
    'coverImage',
    'imageFiles',
    'disabilityOptionsDesc',
    'additionalDescription',
    'descriptionOfTheEnrollmentProcedure',
    'competitiveEventDescriptionItems',
    'benefitsOptionsDesc'
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

  public get areFormsInvalid(): boolean | Observable<boolean> {
    return (
      this.isLoading$ ||
      (!this.RequiredFormGroup.dirty && !this.DescriptionFormGroup.dirty && !this.ContactsFormArray.dirty && !this.JudgeFormArray?.dirty) ||
      this.RequiredFormGroup.invalid ||
      this.DescriptionFormGroup.invalid ||
      this.ContactsFormArray.invalid
    );
  }

  public get IsAllFormsNotDirtyAndInvalid(): boolean {
    return (
      (!this.RequiredFormGroup.dirty && !this.DescriptionFormGroup.dirty && !this.ContactsFormArray.dirty) ||
      this.RequiredFormGroup.invalid ||
      this.DescriptionFormGroup.invalid ||
      this.ContactsFormArray.invalid
    );
  }

  public get isUnfinished(): boolean {
    return this.route.snapshot.paramMap.get('param') === ModeConstants.UNFINISHED;
  }

  public ngOnInit(): void {
    this.entity = this.route.snapshot.paramMap.get('entity') || WorkshopType.Competition;
    this.param = this.route.snapshot.paramMap.get('param');
    const id = Boolean(this.route.snapshot.paramMap.get('id'));

    this.provider$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((provider: Provider) => (this.provider = provider));

    this.determineEditMode();
    this.determineRelease();
    this.addNavPath();

    if (id && this.param) {
      this.parentCompetition = this.route.snapshot.paramMap.get('id');
    }
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
            path: '/personal-cabinet/provider/competitions',
            isActive: false,
            disable: false
          },
          {
            name: this.editMode
              ? this.entity === WorkshopType.Competition
                ? NavBarName.EditCompetition
                : NavBarName.EditCompetitionDraft
              : NavBarName.NewCompetition,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  public setEditMode(): void {
    const param = this.route.snapshot.paramMap.get('param');
    if (param === ModeConstants.UNFINISHED) {
      this.loadUnfinishedCompetitionData();
      this.editMode = false;
    } else {
      switch (this.entity) {
        case WorkshopType.Competition:
          this.store.dispatch(new GetCompetitionById(param));
          break;
        case WorkshopType.Draft:
          this.store.dispatch(new GetCompetitionDraftById(param));
          break;
        default:
          this.editMode = false;
          return;
      }

      this.selectedCompetition$.pipe(takeUntil(this.destroy$), filter(Boolean)).subscribe((competition: Competition | CompetitionDraft) => {
        this.competition = Util.containsWorkshopOrCompetitionDetails(competition) ? competition.competitiveEventDetails : competition;
      });
    }
  }

  public saveUnfinishedData(formGroup: FormGroup | FormArray): void {
    if (formGroup.invalid) {
      return;
    }
    const param = this.route.snapshot.paramMap.get('param');
    if (![ModeConstants.NEW, ModeConstants.UNFINISHED].includes(param)) {
      return;
    }

    const stepMappings = new Map<FormGroup | FormArray, number>([
      [this.RequiredFormGroup, 1],
      [this.DescriptionFormGroup, 2],
      [this.ContactsFormArray, 3]
    ]);

    const step = stepMappings.get(formGroup) ?? -1;
    if (step !== -1) {
      this.stepActions[step]?.();
    }
  }

  public loadUnfinishedCompetitionData(): void {
    this.store.dispatch(new GetUnfinishedCompetition());
    this.unfinishedCompetition$.pipe(filter(Boolean), take(1)).subscribe((draft: Competition) => {
      this.competition = draft;
      asyncScheduler.schedule(() => {
        const stepToGo = this.getFirstInvalidStep();

        if (stepToGo !== -1 && this.stepper) {
          this.stepper.selectedIndex = stepToGo;
        }
      }, 1000);
    });
  }

  /**
   * This method dispatch store action to create a Competition with Form Groups values
   */
  public onSubmit(): void {
    if (this.areFormsInvalid) {
      const provider: Provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
      const requiredInfo: CompetitionRequired = this.createRequired();
      const descInfo: Description = this.createDescription();
      const contacts: Contacts[] = this.createContacts();
      const judges: Judge[] = this.createJudges();

      let competition: Competition;

      if (this.editMode) {
        competition = new Competition(requiredInfo, descInfo, contacts, judges, provider, this.competition.id);
        if (submittingRealEntity(this.entity)) {
          if (shouldBeDraft(this.competition, competition, this.fieldsToCheck)) {
            this.showDraftConfirmationDialog(competition);
          } else {
            this.store.dispatch(new UpdateCompetition(competition));
          }
        } else {
          const draftId = this.route.snapshot.paramMap.get('param');
          this.store.dispatch(new UpdateCompetitionDraft(draftId, competition));
        }
      } else {
        competition = new Competition(requiredInfo, descInfo, contacts, judges, provider);
        this.store.dispatch(new CreateCompetition(competition));
      }
    }
  }

  /**
   * This method receives a form from create-required child component and assigns to the Address FormGroup
   * @param form
   */
  public onReceiveRequiredFormGroup(form: FormGroup): void {
    this.RequiredFormGroup = form;
    setTimeout(() => this.subscribeOnDirtyForm(form));
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
   * This method receives a form from create-address child component and assigns to the Address FormGroup
   * @param array
   */
  public onReceiveContactsFormArray(array: FormArray): void {
    this.ContactsFormArray = array;
    this.subscribeOnDirtyForm(array);
  }

  /**
   * This method receives an array of forms from create-judge child component and assigns to the Judge FormArray
   * @param array
   */
  public onReceiveJudgeFormArray(array: FormArray): void {
    this.JudgeFormArray = array;
    this.subscribeOnDirtyForm(array);
  }

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/competitions']);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(new ResetCompetition());
  }

  private showDraftConfirmationDialog(competition: Competition): void {
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
        this.store.dispatch(new UpdateCompetition(competition));
      });
  }

  private dispatchUnfinishedData(step: number, data: any): void {
    this.store.dispatch(new OnSaveCompetitionStep({ data, step }));
  }

  private getFirstInvalidStep(): number {
    const steps = [
      this.RequiredFormGroup,
      this.DescriptionFormGroup,
      this.ContactsFormArray
      // this.JudgeFormArray
    ];

    return steps.findIndex((step) => !step?.valid && !step?.touched);
  }

  /**
   * Prepares 'Required' section data from the form, setting 'availableSeats' to 'UNLIMITED_SEATS' if null.
   */
  private createRequired(): CompetitionRequired {
    const requiredInfo = this.RequiredFormGroup.getRawValue();
    if (requiredInfo.numberOfSeats === null) {
      requiredInfo.numberOfSeats = this.UNLIMITED_SEATS;
    }
    return requiredInfo;
  }

  private createUnfinishedRequired(): CompetitionRequired {
    const requiredInfo = this.RequiredFormGroup.getRawValue();
    if (requiredInfo.numberOfSeats === null) {
      requiredInfo.numberOfSeats = this.UNLIMITED_SEATS;
    }

    requiredInfo.scheduledStartTime = new Date(requiredInfo.competitionDateRangeGroup.start).toISOString();
    requiredInfo.scheduledEndTime = new Date(requiredInfo.competitionDateRangeGroup.end).toISOString();
    requiredInfo.registrationStartTime = new Date(requiredInfo.registrationDateRangeGroup.start).toISOString();
    requiredInfo.registrationEndTime = new Date(requiredInfo.registrationDateRangeGroup.end).toISOString();

    delete requiredInfo.competitionDateRangeGroup;
    delete requiredInfo.registrationDateRangeGroup;

    if (this.competition?.base64CoverImage) {
      requiredInfo.base64CoverImage = this.competition.base64CoverImage;
    }
    return requiredInfo;
  }

  private createDescription(): Description {
    const description = this.DescriptionFormGroup.getRawValue();
    description.subDirectionIds = description.subDirectionIds?.map((subDirection: Subdirection) => subDirection.id);
    return description;
  }

  /**
   * This method create array of judges
   */
  private createJudges(): Judge[] {
    const judges: Judge[] = [];
    if (this.JudgeFormArray?.controls) {
      this.JudgeFormArray.controls.forEach((form: FormGroup) => {
        const judge: Judge = new Judge(form.value);
        judges.push(judge);
      });
    }
    return judges;
  }

  private createContacts(): Contacts[] {
    return this.ContactsFormArray?.controls.map((form: FormGroup) => new Contacts(form.value)) || [];
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
      $type: this.unfinishedCompetitionTypeMap[step],
      providerId: this.provider.id
    };

    const about$ = createUnfinishedAbout(this.createUnfinishedRequired());
    const descInfo = this.createDescription();
    descInfo.competitiveEventDescriptionItems.forEach((item) => delete item.competitiveEventId);
    let mappedDescInfo = { ...descInfo, plannedFormatOfClasses: descInfo.formOfLearning };
    if (this.competition?.base64ImageFiles?.length) {
      mappedDescInfo = { ...mappedDescInfo, base64ImageFiles: this.competition.base64ImageFiles } as any;
    }
    const description$ = createUnfinishedDescription(mappedDescInfo);
    const contacts$ = this.createContactsWithCodeficator().pipe(map((contacts) => ({ contacts })));
    const stepConfig = new Map<number, Observable<any>[]>([
      [1, [about$]],
      [2, [about$, description$]],
      [3, [about$, description$, contacts$]]
    ]);

    const observables = stepConfig.get(step);

    if (!observables) {
      return of(baseData);
    }
    return forkJoin(observables).pipe(map((results) => ({ ...baseData, ...Object.assign({}, ...results) })));
  }
}
