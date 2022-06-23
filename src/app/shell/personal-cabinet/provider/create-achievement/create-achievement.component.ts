import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserWorkshopService } from 'src/app/shared/services/workshops/user-workshop/user-workshop.service';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss'],
})
export class CreateAchievementComponent implements OnInit, OnDestroy {
  workshop: Workshop;
  workshopId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

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
}
