import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserWorkshopService } from 'src/app/shared/services/workshops/user-workshop/user-workshop.service';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { AchievementsTitle, Constants } from 'src/app/shared/constants/constants';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { CreateAchievement, GetWorkshopById } from 'src/app/shared/store/user.actions';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Child } from 'src/app/shared/models/child.model';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss'],
})
export class CreateAchievementComponent implements OnInit, OnDestroy {
  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;

  AchievementFormGroup: FormGroup;
  title: string;
  workshop: Workshop;
  workshopId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

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
      title: new FormControl(''),
      childrenIDs: new FormControl(''),
      teachers: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.workshopId = this.route.snapshot.paramMap.get('param');
    this.store.dispatch(new GetWorkshopById(this.workshopId));

    this.workshop$
      .pipe(takeUntil(this.destroy$))
      .subscribe((workshop: Workshop) => this.workshop = workshop);
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: { type: ModalConfirmationType.createAchievement },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const achievement = new Achievement(this.title);
        this.store.dispatch(new CreateAchievement(achievement));
      }
    });
  }
}
