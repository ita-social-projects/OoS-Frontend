import { GetAchievementById } from './../../../../shared/store/provider.actions';
import { ProviderState } from './../../../../shared/store/provider.state';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { Achievement, AchievementType } from 'src/app/shared/models/achievement.model';
import { Constants } from 'src/app/shared/constants/constants';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { GetWorkshopById, ResetProviderWorkshopDetails } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Child, ChildCards } from 'src/app/shared/models/child.model';
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
  destroy$: Subject<boolean> = new Subject<boolean>();
  achievement: Achievement;
  workshopId: string;
  approvedChildren: ChildCards;

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
      childrenIDs: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.determineEditMode();
    this.addNavPath();
    this.getData();
  }

  determineEditMode(): void {
    this.achievementId = this.routeParams.snapshot.queryParams['achievementId'];
    this.editMode = !!this.achievementId;
    if (this.editMode) {
      this.setEditMode();
    }
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
        this.AchievementFormGroup.patchValue(achievement, { emitEvent: false });
        // const childrenIDs = achievement.children.map((child: Child) => child.id);
        // this.AchievementFormGroup.get('childrenIDs').setValue(childrenIDs, { emitEvent: false });
      });
  }

  addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subRole = this.store.selectSnapshot<Role>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subRole);

    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/personal-cabinet/provider/workshops',
            isActive: false,
            disable: false,
          },
          {
            name: this.editMode ? NavBarName.UpdateAchievement : NavBarName.CreateAchievement,
            isActive: false,
            disable: true,
          }
        )
      )
    );
  }

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.createAchievement,
        property: '',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const achievement = new Achievement(
          this.AchievementFormGroup.value,
          this.workshopId,
          this.AchievementFormGroup.controls.childrenIDs.value.map(child => (child = child.id)),
          this.AchievementFormGroup.controls.teachers.value.map(
            teacher => (teacher = `${teacher.lastName} ${teacher.firstName}`)
          )
        );
        this.store.dispatch(new CreateAchievement(achievement));
      }
    });
  }

  onRemoveItem(item: string, control): void {
    let items = this.AchievementFormGroup.controls[control].value;
    if (items.indexOf(item) >= 0) {
      items.splice(items.indexOf(item), 1);
      if (items.length !== 0) {
        this.AchievementFormGroup.get(control).setValue([...items]);
      } else {
        this.AchievementFormGroup.get(control).setValue(null);
      }
    }
  }

  getFullName(person: Person): string {
    return Util.getFullName(person);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ResetProviderWorkshopDetails());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
