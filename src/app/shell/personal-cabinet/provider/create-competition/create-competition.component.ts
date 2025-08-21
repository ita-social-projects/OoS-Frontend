import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil, first } from 'rxjs/operators';

import { NavBarName, PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { Role } from 'shared/enum/role';
import { Competition, CompetitionDraft, CompetitionRequired, Description } from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { GetCompetitionById, GetCompetitionDraftById, ResetCompetition } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { Judge } from 'shared/models/judge.model';
import { Constants } from 'shared/constants/constants';
import { CreateCompetition, UpdateCompetition, UpdateCompetitionDraft } from 'shared/store/provider.actions';
import { Contacts } from 'shared/models/workshop.model';
import { SubDirection } from 'shared/models/category.model';
import { WorkshopType } from 'shared/enum/workshop';
import { Util } from 'shared/utils/utils';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
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
  @Select(RegistrationState.provider)
  private provider$: Observable<Provider>;
  @Select(SharedUserState.selectedCompetition)
  private selectedCompetition$: Observable<Competition>;

  public provider: Provider;
  public competition: Competition;
  public parentCompetition: string;

  public RequiredFormGroup: FormGroup;
  public DescriptionFormGroup: FormGroup;
  public ContactsFormArray: FormArray;
  public JudgeFormArray: FormArray;

  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;

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
      this.ContactsFormArray.invalid ||
      this.JudgeFormArray?.invalid
    );
  }

  public ngOnInit(): void {
    this.provider$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((provider: Provider) => (this.provider = provider));

    this.determineEditMode();
    this.determineRelease();
    this.addNavPath();

    const id = Boolean(this.route.snapshot.paramMap.get('id'));
    const param = Boolean(this.route.snapshot.paramMap.get('param'));
    if (id && param) {
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
            name: this.editMode ? NavBarName.EditCompetition : NavBarName.NewCompetition,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  public setEditMode(): void {
    const competitionId = this.route.snapshot.paramMap.get('param');
    if (!this.route.snapshot.paramMap.has('entity')) {
      this.store.dispatch(new GetCompetitionById(competitionId));
    } else {
      this.store.dispatch(new GetCompetitionDraftById(competitionId));
    }
    this.selectedCompetition$.pipe(filter(Boolean), first()).subscribe((competition: Competition | CompetitionDraft) => {
      this.competition = Util.containsWorkshopOrCompetitionDetails(competition) ? competition.competitiveEventDetails : competition;
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
        if (this.route.snapshot.paramMap.get('entity') === WorkshopType.Competition) {
          if (this.shouldBeDraft(competition)) {
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
    this.subscribeOnDirtyForm(form);
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

  private createDescription(): Description {
    const description = this.DescriptionFormGroup.getRawValue();
    description.subDirectionIds = description.subDirectionIds.map((subDirection: SubDirection) => subDirection.id);
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

  private shouldBeDraft(competition: Competition): boolean {
    const fieldsToCheck = [
      'title',
      'shortTitle',
      'coverImage',
      'imageFiles',
      'description',
      'disabilityOptionsDesc',
      'additionalDescription',
      'descriptionOfTheEnrollmentProcedure',
      'competitiveEventDescriptionItems',
      'benefitsOptionsDesc'
    ];

    return fieldsToCheck.some((fieldName) => {
      if (typeof competition[fieldName] === 'object' && typeof this.competition[fieldName] === 'object') {
        return !Util.deepEqual(competition[fieldName], this.competition[fieldName]);
      }

      return (
        competition[fieldName] !== this.competition[fieldName] &&
        (!Util.isEmpty(competition[fieldName]) || !Util.isEmpty(this.competition[fieldName]))
      );
    });
  }
}
