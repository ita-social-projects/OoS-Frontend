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
  destroy$: Subject<boolean> = new Subject<boolean>();
  achievement: Achievement;
  achievements = AchievementsTitle;

  children$ = [
    { id: '1', lastName: 'Тетерукова', firstName: 'Дарина' },
    { id: '2', lastName: 'Узумакі', firstName: 'Боруто' },
    { id: '3', lastName: 'Малинка', firstName: 'Малина' },
    { id: '4', lastName: 'Малинка', firstName: 'Малина' },
    { id: '5', lastName: 'Rtdby', firstName: 'Малина' },
    { id: '6', lastName: 'Малинка', firstName: 'Малина' },
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
    let workshopId = this.route.snapshot.paramMap.get('param');
    this.store.dispatch(new GetWorkshopById(workshopId));
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
        const achievement = new Achievement(
          this.AchievementFormGroup.value); 
        this.store.dispatch(new CreateAchievement(achievement));
      }
    });    
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
