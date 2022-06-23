import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetWorkshopById } from 'src/app/shared/store/user.actions';
import { takeUntil } from 'rxjs/operators';
import { UserState } from 'src/app/shared/store/user.state';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss'],
})
export class CreateAchievementComponent implements OnInit {
  // @Select(UserState.selectedWorkshop)
  // workshop$: Observable<Workshop>;
  // workshop: Workshop;
  destroy$: Subject<boolean> = new Subject<boolean>();

  children$ = [
    { lastName: 'Тетерукова', firstName: 'Дарина' },
    { lastName: 'Узумакі', firstName: 'Боруто' },
    { lastName: 'Малинка', firstName: 'Малина' },
  ];

  constructor(private store: Store, private route: ActivatedRoute, private router: Router,) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        console.log('this.router.url', params.param);        
      });
    // this.setDataSubscribtion();
  }
}
