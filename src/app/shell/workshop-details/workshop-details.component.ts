import { takeUntil } from 'rxjs/operators';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { GetWorkshopsById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  workshop: Workshop;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private actions$: Actions,
    public navigationBarService: NavigationBarService,
  ) { }

  ngOnInit(): void {
    const workshopId = +this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetWorkshopsById(workshopId));
    this.actions$
    .pipe(ofActionSuccessful(GetWorkshopsById),takeUntil(this.destroy$))
    .subscribe(()=> {
      this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
        {name:NavBarName.TopWorkshops, path:'/result', isActive: false, disable: false},
        {name:this.store.selectSnapshot(UserState.selectedWorkshop).title, isActive: false, disable: true},
        )));
    });
  }
  
  ngOnDestroy():void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
