import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { AchievementsTitle, Constants } from 'src/app/shared/constants/constants';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { CreateAchievement, GetWorkshopById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss'],
})
export class CreateAchievementComponent implements OnInit, OnDestroy {
  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;

  AchievementFormGroup: FormGroup;
  workshop: Workshop;
  workshopId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  achievement: Achievement;
  achievements = AchievementsTitle;

  children$ = [
    { lastName: 'Тетерукова', firstName: 'Дарина' },
    { lastName: 'Узумакі', firstName: 'Боруто' },
    { lastName: 'Малинка', firstName: 'Малина' },
    { lastName: 'Малинка', firstName: 'Малина' },
    { lastName: 'Rtdby', firstName: 'Малина' },
    { lastName: 'Малинка', firstName: 'Малина' },
  ];

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AchievementFormGroup = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      childrenIDs: new FormControl(''),
      teachers: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.workshopId = this.route.snapshot.paramMap.get('param')
    this.store.dispatch(new GetWorkshopById(this.workshopId));
    this.workshop$
    .pipe(takeUntil(this.destroy$))
    .subscribe((workshop: Workshop) => this.workshop = workshop);      
  } 

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: { 
        type: ModalConfirmationType.createAchievement
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const achievement = new Achievement(this.AchievementFormGroup.controls.title.value[0], this.workshopId); 
        this.store.dispatch(new CreateAchievement(achievement));
      }
    });    
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
