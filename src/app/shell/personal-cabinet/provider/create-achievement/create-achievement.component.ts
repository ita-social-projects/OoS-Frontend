import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
import { CreateAchievement, 
  GetChildrenByWorkshopId, 
  GetWorkshopById, 
  ResetProviderWorkshopDetails } 
  from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { ChildCards } from 'src/app/shared/models/child.model';
import { Person } from 'src/app/shared/models/user.model';
import { Util } from 'src/app/shared/utils/utils';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { GetAchievementsType } from 'src/app/shared/store/meta-data.actions';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss'],
})
export class CreateAchievementComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  @Select(UserState.selectedWorkshop) 
  workshop$: Observable<Workshop>;
  @Select(UserState.approvedChildren) 
  approvedChildren$: Observable<ChildCards>;
  @Select(MetaDataState.achievementsTypes)
  achievementsTypes$: Observable<AchievementType[]>;

  AchievementFormGroup: FormGroup;
  workshop: Workshop;
  destroy$: Subject<boolean> = new Subject<boolean>();
  achievement: Achievement;
  workshopId: string;
  approvedChildren: ChildCards;

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AchievementFormGroup = this.formBuilder.group({
      title: new FormControl('', [ 
        Validators.required, 
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000)]),
      achievementDate: new FormControl('', Validators.required),
      achievementTypeId: new FormControl('', Validators.required),
      teachers: new FormControl('', Validators.required),
      childrenIDs: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.workshopId = this.route.snapshot.paramMap.get('param');
    this.store.dispatch([
      new GetWorkshopById(this.workshopId), 
      new GetChildrenByWorkshopId(this.workshopId)
    ]);

    this.workshop$
    .pipe(
      takeUntil(this.destroy$),
      filter((workshop) => !!workshop)
    ).subscribe((workshop: Workshop) => {
      this.workshop = workshop;
      this.store.dispatch(new GetAchievementsType());
    });       
    this.approvedChildren$
    .pipe(
      takeUntil(this.destroy$),
      filter((approvedChildren) => !!approvedChildren)
    ).subscribe((approvedChildren: ChildCards) => this.approvedChildren = approvedChildren);
  } 

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: { 
        type: ModalConfirmationType.createAchievement,
        property: ''
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const achievement = new Achievement(
          this.AchievementFormGroup.value, 
          this.workshopId,
          this.AchievementFormGroup.controls.childrenIDs.value.map((child => child = child.id)),
          this.AchievementFormGroup.controls.teachers.value.map((teacher => teacher = `${teacher.lastName} ${teacher.firstName}`))
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
        this.AchievementFormGroup.get(control).setValue(null)
      }
    }   
  }

  private getFullName(person: Person): string {
    return Util.getFullName(person);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ResetProviderWorkshopDetails());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
