import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Role, Subrole } from 'shared/enum/role';
import { Competition } from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { GetCompetitionById } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { Util } from 'shared/utils/utils';
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

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/competitions']);
  }

  public onSubmit(): void {}

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

  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public onReceiveRequiredFormGroup(form: FormGroup): void {
    this.RequiredFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }
}
