import { takeUntil } from 'rxjs/operators';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Nav } from 'src/app/shared/models/navigation.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { GetWorkshopsById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
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
    private actions$: Actions
  ) { }

  /**
    * This method create new Navigation button
    */
  creatNavPath(name: string, isActive: boolean, disable: boolean): Nav[] {
    return [
    {name:'Головна', path:'/', isActive:true, disable:false},
    {name:'Найпопулярніші гуртки',path:'/result', isActive:false, disable:false},
    {name:name, isActive:isActive, disable:disable}
    ]
  }

  ngOnInit(): void {
    const workshopId = +this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetWorkshopsById(workshopId));
    this.actions$
    .pipe(ofActionSuccessful(GetWorkshopsById),takeUntil(this.destroy$))
    .subscribe(()=> {
      this.store.dispatch(new AddNavPath(this.creatNavPath(this.store.selectSnapshot(UserState.selectedWorkshop).title,false,true)));
    })
  }
  
  ngOnDestroy():void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
