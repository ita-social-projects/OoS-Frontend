import { Component, OnInit, OnDestroy } from '@angular/core';
import { UpdateCurrentView } from '../../shared/result.actions';
import { Store } from '@ngxs/store';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { Nav } from 'src/app/shared/models/navigation.model';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  public currentView: string;
  isFiltersVisible: boolean = true;

  constructor(private store: Store) { }

  /**
    * This method create new Navigation button
    */
  creatNavPath(name:string, isActive: boolean, disable: boolean): Nav[] {
    return [
      {name:'Головна',path:'/', isActive:true, disable:false},
      {name:name, isActive:isActive, disable:disable}
    ]
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.currentView = 'show-data';
    this.store.dispatch(new AddNavPath(this.creatNavPath("Найпопулярніші гуртки",false,true)))
  }
  
  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }

  public SetCurrentView(view: string) {
    this.currentView = view;
    this.store.dispatch(new UpdateCurrentView(view));
  }
}
