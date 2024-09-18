import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Role, Subrole } from 'shared/enum/role';
import { Competition, CompetitionRequired } from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { GetCompetitionById } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { Util } from 'shared/utils/utils';
import { Judge } from 'shared/models/judge.model';
import { Constants } from 'shared/constants/constants';
import { Address } from 'shared/models/address.model';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-competition',
  templateUrl: './create-competition.component.html',
  styleUrls: ['./create-competition.component.scss']
})
export class CreateCompetitionComponent extends CreateFormComponent implements OnInit, AfterContentChecked, OnDestroy {
  @Select(RegistrationState.provider)
  private provider$: Observable<Provider>;
  @Select(SharedUserState.selectedCompetition)
  private selectedCompetition$: Observable<Competition>;

  public provider: Provider;
  public competition: Competition;

  public RequiredFormGroup: FormGroup;
  public DescriptionFormGroup: FormGroup;
  public AddressFormGroup: FormGroup;
  public JudgeFormArray: FormArray;

  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {
    super(store, route, navigationBarService);
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
  }

  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subrole = this.store.selectSnapshot<Subrole>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subrole);
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
    this.store.dispatch(new GetCompetitionById(competitionId));
    this.selectedCompetition$
      .pipe(
        takeUntil(this.destroy$),
        filter((competition: Competition) => competition?.id === competitionId)
      )
      .subscribe((competition: Competition) => (this.competition = competition));
  }

  /**
   * This method dispatch store action to create a Competition with Form Groups values
   */
  public onSubmit(): void {
    const provider: Provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    const requiredInfo: CompetitionRequired = this.createRequired();
    const descInfo = this.DescriptionFormGroup.getRawValue();
    const address: Address = new Address(this.AddressFormGroup.value, this.competition?.address);
    const judges: Judge[] = this.createJudges();

    let competition: Competition;

    if (this.editMode) {
      competition = new Competition(requiredInfo, descInfo, address, judges, provider, this.competition.id);
      // this.store.dispatch(new UpdateCompetition(competition));
    } else {
      competition = new Competition(requiredInfo, descInfo, address, judges, provider);
      // this.store.dispatch(new CreateCompetition(competition));
    }
  }

  /**
   * This method receives a form from create-required child component and assigns to the Address FormGroup
   * @param FormGroup form
   */
  public onReceiveRequiredFormGroup(form: FormGroup): void {
    this.RequiredFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives a from create-description child component and assigns to the Description FormGroup
   * @param FormGroup form
   */
  public onReceiveDescriptionFormGroup(form: FormGroup): void {
    this.DescriptionFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives a form from create-address child component and assigns to the Address FormGroup
   * @param FormGroup form
   */
  public onReceiveAddressFormGroup(form: FormGroup): void {
    this.AddressFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives an array of forms from create-judge child component and assigns to the Judge FormArray
   * @param FormArray array
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
    // this.store.dispatch(new ResetProviderCompetitionDetails());
  }

  /**
   * Prepares 'Required' section data from the form, setting 'availableSeats' to 'UNLIMITED_SEATS' if null.
   */
  private createRequired(): CompetitionRequired {
    const requiredInfo = this.RequiredFormGroup.getRawValue();
    if (requiredInfo.availableSeats === null) {
      requiredInfo.availableSeats = this.UNLIMITED_SEATS;
    }
    return requiredInfo;
  }

  /**
   * This method create array of judges
   * @param FormArray formArray
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
}
