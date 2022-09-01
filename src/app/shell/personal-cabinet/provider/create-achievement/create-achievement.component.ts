import { ProviderState } from './../../../../shared/store/provider.state';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { Achievement, AchievementType, AchievmentTeacherValue } from 'src/app/shared/models/achievement.model';
import { Constants } from 'src/app/shared/constants/constants';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { GetWorkshopById, ResetProviderWorkshopDetails } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { ChildCards } from 'src/app/shared/models/child.model';
import { Person } from 'src/app/shared/models/user.model';
import { Util } from 'src/app/shared/utils/utils';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { GetAchievementsType } from 'src/app/shared/store/meta-data.actions';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Role } from 'src/app/shared/enum/role';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { Location } from '@angular/common';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { CreateAchievement, GetChildrenByWorkshopId } from 'src/app/shared/store/provider.actions';
import { GetAchievementById, UpdateAchievement, ResetAchievements } from './../../../../shared/store/provider.actions';
import { Navigation } from 'src/app/shared/models/navigation.model';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss'],
})
export class CreateAchievementComponent extends CreateFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;

  @Select(UserState.selectedWorkshop)
  workshop$: Observable<Workshop>;
  @Select(ProviderState.approvedChildren)
  approvedChildren$: Observable<ChildCards>;
  @Select(ProviderState.selectedAchievement)
  selectedAchievement$: Observable<Achievement>;
  @Select(MetaDataState.achievementsTypes)
  achievementsTypes$: Observable<AchievementType[]>;

  AchievementFormGroup: FormGroup;
  workshop: Workshop;
  achievement: Achievement;
  workshopId: string;
  approvedChildren: ChildCards;
  destroy$: Subject<boolean> = new Subject<boolean>();

  get teachersFormControl(): FormControl {
    return this.AchievementFormGroup.get('teachers') as FormControl;
  }
  get childrenFormControl(): FormControl {
    return this.AchievementFormGroup.get('children') as FormControl;
  }
  get achievementTypeIdFormControl(): FormControl {
    return this.AchievementFormGroup.get('achievementTypeId') as FormControl;
  }

  private achievementId: string;

  constructor(
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private location: Location,
    private routeParams: ActivatedRoute
  ) {
    super(store, route, navigationBarService);
    this.AchievementFormGroup = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
      ]),
      achievementDate: new FormControl('', Validators.required),
      achievementTypeId: new FormControl('', Validators.required),
      teachers: new FormControl('', Validators.required),
      children: new FormControl('', Validators.required),
    });

    this.subscribeOnDirtyForm(this.AchievementFormGroup);
  }

  ngOnInit(): void {
    this.getData();
  }

  determineEditMode(): void {
    this.achievementId = this.routeParams.snapshot.queryParams['achievementId'];
    this.editMode = !!this.achievementId;
    if (this.editMode) {
      this.setEditMode();
    }
    this.addNavPath();
  }

  getData(): void {
    this.workshopId = this.route.snapshot.paramMap.get('param');
    this.store.dispatch([
      new GetWorkshopById(this.workshopId),
      new GetChildrenByWorkshopId(this.workshopId),
      new GetAchievementsType(),
    ]);

    combineLatest([this.workshop$, this.approvedChildren$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([workshop, approvedChildren]: [Workshop, ChildCards]) => !!(workshop && approvedChildren))
      )
      .subscribe(([workshop, approvedChildren]: [Workshop, ChildCards]) => {
        this.workshop = workshop;
        this.approvedChildren = approvedChildren;
        this.determineEditMode();
      });
  }

  setEditMode(): void {
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

  addNavPath(): void {
    let prevPath: Navigation;

    if (this.editMode) {
      prevPath = {
        name: this.workshop.title,
        path: `/details/workshop/${this.workshopId}`,
        isActive: false,
        disable: false,
      };
    } else {
      const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
      const subRole = this.store.selectSnapshot<Role>(RegistrationState.subrole);
      const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subRole);

      prevPath = {
        name: personalCabinetTitle,
        path: '/personal-cabinet/provider/workshops',
        isActive: false,
        disable: false,
      };
    }

    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(prevPath, {
          name: this.editMode ? NavBarName.UpdateAchievement : NavBarName.CreateAchievement,
          isActive: false,
          disable: true,
        })
      )
    );
  }

  onBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.editMode) {
      const achievement = new Achievement(this.AchievementFormGroup.getRawValue(), this.workshopId, this.achievement);
      this.store.dispatch(new UpdateAchievement(achievement));
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.createAchievement,
        property: '',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const achievement = new Achievement(this.AchievementFormGroup.getRawValue(), this.workshopId, this.achievement);
        this.store.dispatch(new CreateAchievement(achievement));
      }
    });
  }

  onRemoveItem(item: string, control: string): void {
    const formControl = this.AchievementFormGroup.get(control);
    let items = formControl.value;
    if (items.indexOf(item) >= 0) {
      items.splice(items.indexOf(item), 1);
      if (items.length !== 0) {
        formControl.setValue([...items]);
      } else {
        formControl.setValue(null);
      }
    }
  }

  compareEntities(person1: Person, person2: Person): boolean {
    return person1.id === person2.id;
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ResetProviderWorkshopDetails(), new ResetAchievements());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
