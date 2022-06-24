import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserWorkshopService } from 'src/app/shared/services/workshops/user-workshop/user-workshop.service';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { AchievementsTitle, Constants } from 'src/app/shared/constants/constants';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { CreateAchievement } from 'src/app/shared/store/user.actions';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Child } from 'src/app/shared/models/child.model';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss'],
})
export class CreateAchievementComponent implements OnInit, OnDestroy {
  workshop: Workshop;
  teachers: Teacher[];
  children: Child[];
  workshopId: string;
  title;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ChildFormControl = new FormControl('', Validators.required);
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
    private userWorkshopService: UserWorkshopService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.workshopId = this.route.snapshot.paramMap.get('param');
    this.userWorkshopService
      .getWorkshopById(this.workshopId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((workshop) => {
        this.workshop = workshop;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.createAchievement,
        property: this.workshop.title,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const achievement = new Achievement(
          this.title,
          this.workshop,
          this.children
        );
        this.store.dispatch(new CreateAchievement(achievement));
      }
    });
  }
}
