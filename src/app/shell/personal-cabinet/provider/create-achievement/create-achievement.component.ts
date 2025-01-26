import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { NavBarName, PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { Achievement, AchievementType } from 'shared/models/achievement.model';
import { Child } from 'shared/models/child.model';
import { Navigation } from 'shared/models/navigation.model';
import { SearchResponse } from 'shared/models/search.model';
import { Person } from 'shared/models/user.model';
import { Workshop } from 'shared/models/workshop.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { GetAchievementsType } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { AddNavPath } from 'shared/store/navigation.actions';
import { CreateAchievement, GetAchievementById, GetChildrenByWorkshopId, UpdateAchievement } from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { RegistrationState } from 'shared/store/registration.state';
import { GetWorkshopById, ResetProviderWorkshopDetails } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss']
})
export class CreateAchievementComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(SharedUserState.selectedWorkshop)
  private workshop$: Observable<Workshop>;
  @Select(ProviderState.approvedChildren)
  private approvedChildren$: Observable<SearchResponse<Child[]>>;
  @Select(ProviderState.selectedAchievement)
  private selectedAchievement$: Observable<Achievement>;
  @Select(MetaDataState.achievementsTypes)
  private achievementsTypes$: Observable<AchievementType[]>;

  public workshop: Workshop;
  private readonly validationConstants = ValidationConstants;
  private AchievementFormGroup: FormGroup;
  private achievement: Achievement;
  private workshopId: string;
  private approvedChildren: SearchResponse<Child[]>;
  private isSaving: boolean = false;
  private minDate: Date;
  private maxDate: Date;
  private achievementId: string;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) {
    super(store, route, navigationBarService);
    this.AchievementFormGroup = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      achievementDate: new FormControl('', Validators.required),
      achievementTypeId: new FormControl('', Validators.required),
      teachers: new FormControl('', Validators.required),
      children: new FormControl('', Validators.required)
    });
    this.subscribeOnDirtyForm(this.AchievementFormGroup);
  }

  public get teachersFormControl(): FormControl {
    return this.AchievementFormGroup.get('teachers') as FormControl;
  }

  public get childrenFormControl(): FormControl {
    return this.AchievementFormGroup.get('children') as FormControl;
  }

  public get achievementTypeIdFormControl(): FormControl {
    return this.AchievementFormGroup.get('achievementTypeId') as FormControl;
  }

  public ngOnInit(): void {
    this.getData();
    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear() - 100, currentDate.getMonth(), currentDate.getDate());
    this.maxDate = new Date(currentDate.getFullYear() + 100, currentDate.getMonth(), currentDate.getDate());
  }

  public determineEditMode(): void {
    this.achievementId = this.route.snapshot.queryParamMap.get('achievementId');
    this.editMode = !!this.achievementId;
    if (this.editMode) {
      this.setEditMode();
    }
    this.addNavPath();
  }

  public getData(): void {
    this.workshopId = this.route.snapshot.paramMap.get('param');
    this.store.dispatch([new GetWorkshopById(this.workshopId), new GetChildrenByWorkshopId(this.workshopId), new GetAchievementsType()]);

    combineLatest([this.workshop$, this.approvedChildren$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([workshop, approvedChildren]: [Workshop, SearchResponse<Child[]>]) => !!(workshop && approvedChildren))
      )
      .subscribe(([workshop, approvedChildren]: [Workshop, SearchResponse<Child[]>]) => {
        this.workshop = workshop;
        this.approvedChildren = approvedChildren;
        this.determineEditMode();
      });
  }

  public setEditMode(): void {
    this.store.dispatch(new GetAchievementById(this.achievementId));
    this.selectedAchievement$
      .pipe(
        takeUntil(this.destroy$),
        filter((achievement: Achievement) => !!achievement)
      )
      .subscribe((achievement: Achievement) => {
        this.achievement = achievement;
        this.teachersFormControl.clearValidators();
        this.AchievementFormGroup.patchValue(achievement, { emitEvent: false });
      });
  }

  public addNavPath(): void {
    let prevPath: Navigation;

    if (this.editMode) {
      prevPath = {
        name: this.workshop.title,
        path: `/details/workshop/${this.workshopId}`,
        isActive: false,
        disable: false
      };
    } else {
      const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
      const personalCabinetTitle = PersonalCabinetTitle[userRole];

      prevPath = {
        name: personalCabinetTitle,
        path: '/personal-cabinet/provider/workshops',
        isActive: false,
        disable: false
      };
    }

    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(prevPath, {
          name: this.editMode ? NavBarName.UpdateAchievement : NavBarName.CreateAchievement,
          isActive: false,
          disable: true
        })
      )
    );
  }

  public onSubmit(): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    if (this.editMode) {
      const achievement = new Achievement(this.AchievementFormGroup.getRawValue(), this.workshopId, this.achievement);
      this.store.dispatch(new UpdateAchievement(achievement));
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.createAchievement,
        property: ''
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const achievement = new Achievement(this.AchievementFormGroup.getRawValue(), this.workshopId, this.achievement);
        this.store
          .dispatch(new CreateAchievement(achievement))
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.isSaving = false;
          });
        return;
      }
      this.isSaving = false;
    });
  }

  public onCancel(): void {
    this.router.navigate(['/details/workshop', this.workshopId], { queryParams: { status: 'Achievements' } });
  }

  public onRemoveItem(item: string, control: string): void {
    const formControl = this.AchievementFormGroup.get(control);
    const items = formControl.value;
    if (items.indexOf(item) >= 0) {
      items.splice(items.indexOf(item), 1);
      if (items.length !== 0) {
        formControl.setValue([...items]);
      } else {
        formControl.setValue(null);
      }
    }
  }

  public compareEntities(person1: Person, person2: Person): boolean {
    return person1.id === person2.id;
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new ResetProviderWorkshopDetails());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
