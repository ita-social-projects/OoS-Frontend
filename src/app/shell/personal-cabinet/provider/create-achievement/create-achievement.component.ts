import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserWorkshopService } from 'src/app/shared/services/workshops/user-workshop/user-workshop.service';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { Constants } from 'src/app/shared/constants/constants';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { CreateAchievement } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss'],
})
export class CreateAchievementComponent implements OnInit, OnDestroy {
  workshop: Workshop;
  workshopId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ChildFormControl = new FormControl('', Validators.required);

  children$ = [
    { lastName: 'Тетерукова', firstName: 'Дарина' },
    { lastName: 'Узумакі', firstName: 'Боруто' },
    { lastName: 'Малинка', firstName: 'Малина' },
    { lastName: 'Малинка', firstName: 'Малина' },
    { lastName: 'Rtdby', firstName: 'Малина' },
    { lastName: 'Малинка', firstName: 'Малина' },
  ];

  achievements = [
    {
      name: 'Переможці міжнародних та всеукраїнських спортивних змагань (індивідуальних та командних',
    },
    {
      name: 'Призери та учасники міжнародних, всеукраїнських та призери регіональних конкурсів і виставок наукових, технічних, дослідницьких, інноваційних, ІТ проектів',
    },
    {
      name: 'Реципієнти міжнародних грантів',
    },
  ];

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private userWorkshopService: UserWorkshopService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.workshopId = params.param;
      });
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
        type: ModalConfirmationType.createApplication,
        property: this.workshop.title,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const achievement = new Achievement(this.workshop);
        this.store.dispatch(new CreateAchievement(achievement));
      }
    });
  }
}
