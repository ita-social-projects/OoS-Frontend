import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { asyncScheduler, Observable, of, zip } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import { Constants, ModeConstants } from 'shared/constants/constants';
import { NavBarName, PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { Role } from 'shared/enum/role';
import { Provider } from 'shared/models/provider.model';
import { Teacher } from 'shared/models/teacher.model';
import { Contacts, Workshop, WorkshopAbout, AdditionalAbout, WorkshopDraft } from 'shared/models/workshop.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import {
  CreateWorkshopDraft,
  GetUnfinishedWorkshop,
  OnDeleteUnfinishedWorkshop,
  OnSaveWorkshopStep,
  UpdateDraft,
  UpdateWorkshop
} from 'shared/store/provider.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { GetWorkshopById, GetWorkshopDraftById, ResetProviderWorkshopDetails } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { ShowMessageBar } from 'shared/store/app.actions';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { WorkshopType } from 'shared/models/draftWorkshop.model';
import { GetCodeficatorById } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { Codeficator } from 'shared/models/codeficator.model';
import { Address } from 'shared/models/address.model';
import { WorkshopType1 } from 'shared/enum/workshop';
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
  public unfinishedWorkshop$ = this.store.select((state) => state.provider.unfinishedWorkshop.workshopForLoading);
  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;
  public provider: Provider;
  public workshop: Workshop | WorkshopDraft;

  public AboutFormGroup: FormGroup;
  public DescriptionFormGroup: FormGroup;
  public AdditionalAboutGroup: FormGroup;
  public AddressFormGroup: FormGroup;
  public TeacherFormArray: FormArray;
  public WorkshopContactsFormArray: FormArray;

  private readonly unfinishedWorkshopTypeMap = {
    1: WorkshopType.WithMainProperties,
    2: WorkshopType.WithOtherRequiredProperties,
    3: WorkshopType.WithDescription,
    4: WorkshopType.WithContacts
  };
  private readonly stepActions = {
    1: (): void => this.dispatchUnfinishedData(1, this.createAbout()),
    2: (): void => this.dispatchUnfinishedData(2, this.createAdditionalAbout()),
    3: (): void =>
      this.dispatchUnfinishedData(3, { ...this.AdditionalAboutGroup.getRawValue(), ...this.DescriptionFormGroup.getRawValue() }),
    4: (): void => {
      this.handleContactsStep();
    }
  };

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
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

  public ngOnInit(): void {
    this.provider$
      .pipe(
        takeUntil(this.destroy$),
        filter((provider: Provider) => !!provider)
      )
      .subscribe((provider: Provider) => (this.provider = provider));

    this.determineEditMode();
    this.determineRelease();
    this.addNavPath();
    const param = this.getRouteParam();
    if (param === ModeConstants.UNFINISHED) {
      this.loadUnfinishedWorkshopData();
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
            path: '/personal-cabinet/provider/administration',
            isActive: false,
            disable: false
          },
          {
            name: this.editMode ? NavBarName.EditWorkshop : NavBarName.NewWorkshop,
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
      switch (this.route.snapshot.paramMap.get('entity')) {
        case WorkshopType1.Workshop.toLowerCase():
          this.store.dispatch(new GetWorkshopById(param));
          break;
        case WorkshopType1.Draft.toLowerCase():
          this.store.dispatch(new GetWorkshopDraftById(param));
          break;
      }

      this.selectedWorkshop$
        .pipe(
          takeUntil(this.destroy$),
          filter((workshop) => workshop !== null)
        )
        .subscribe((workshop: Workshop | WorkshopDraft) => {
          this.workshop = 'workshopDetails' in workshop ? workshop.workshopDetails : workshop;
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
    this.unfinishedWorkshop$.subscribe((draft: Workshop) => {
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
      if (this.route.snapshot.paramMap.get('entity') === WorkshopType1.Workshop && this.shouldBeDraft(workshop)) {
        this.store.dispatch(new UpdateWorkshop(workshop));
      } else if (this.route.snapshot.paramMap.get('entity') === WorkshopType1.Workshop && !this.shouldBeDraft(workshop)) {
        this.store.dispatch(new CreateWorkshopDraft(workshop));
      } else {
        const draftId = this.getRouteParam();
        this.store.dispatch(new UpdateDraft(draftId, workshop));
      }
    } else {
      workshop = new Workshop(aboutInfo, descInfo, contacts, additionalAboutInfo, teachers, provider);
      this.store.dispatch(new CreateWorkshopDraft(workshop));
    }
    this.store.dispatch(new OnDeleteUnfinishedWorkshop());
  }

  /**
   * This method receives a form from create-address child component and assigns to the Address FormGroup
   * @param form
   */
  public onReceiveAddressFormGroup(form: FormGroup): void {
    this.AddressFormGroup = form;
    this.subscribeOnDirtyForm(form);
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
    this.store.dispatch(new ResetProviderWorkshopDetails());
  }

  // eslint-disable-next-line @typescript-eslint/typedef
  private createDraftData(step: number, extraData = {}): any {
    const baseData = {
      $type: this.unfinishedWorkshopTypeMap[step],
      ...this.createAbout(),
      providerId: this.provider.id
    };

    return {
      ...baseData,
      ...extraData
    };
  }

  // eslint-disable-next-line @typescript-eslint/typedef
  private dispatchUnfinishedData(step: number, extraData = {}): void {
    const data = this.createDraftData(step, extraData);
    this.store.dispatch(new OnSaveWorkshopStep({ data, step }));
  }

  private handleContactsStep(): void {
    const contacts = this.createContacts();
    const contactsToUpdate = contacts.map((contact) => {
      if (contact.address?.catottgId) {
        this.store.dispatch(new GetCodeficatorById(contact.address.catottgId));

        return this.codeficator$.pipe(
          filter((codeficator) => codeficator?.id === contact.address.catottgId),
          take(1),
          map((codeficatorData) => ({
            ...contact,
            address: new Address({
              ...contact.address,
              codeficatorAddressDto: codeficatorData
            })
          }))
        );
      }
      return of(contact);
    });

    zip(...contactsToUpdate).subscribe((updatedContacts) => {
      this.dispatchUnfinishedData(4, {
        ...this.AdditionalAboutGroup.value,
        ...this.DescriptionFormGroup.getRawValue(),
        contacts: updatedContacts
      });
    });
  }

  private getFirstInvalidStep(): number {
    const steps = [
      this.AboutFormGroup,
      this.AdditionalAboutGroup,
      this.DescriptionFormGroup,
      this.WorkshopContactsFormArray,
      this.TeacherFormArray
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
    if (additionalInfo.price === null) {
      additionalInfo.price = 0;
      additionalInfo.isPaid = false;
    }

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

  private shouldBeDraft(newWorkshop: Workshop): boolean {
    const fieldsToCheck = [
      'title',
      'shortTitle',
      'imageFiles',
      'coverImage',
      'competitiveSelectionDescription',
      'workshopDescriptionItems',
      'disabilityOptionsDesc',
      'keywords',
      'enrollmentProcedureDescription',
      'preferentialTermsOfParticipation'
    ];

    for (const fieldName in fieldsToCheck) {
      if (newWorkshop[fieldName] !== this.workshop[fieldName]) {
        return true;
      }
    }

    return false;
  }
}
