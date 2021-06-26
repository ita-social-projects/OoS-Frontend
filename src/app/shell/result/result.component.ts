import { Component, OnInit, OnDestroy } from '@angular/core';
import { UpdateCurrentView } from '../../shared/result.actions';
import { Store } from '@ngxs/store';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  public currentView: string;
  isFiltersVisible: boolean = true;

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService,
    ) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.currentView = 'show-data';
    this.store.dispatch(new AddNavPath(this.navigationBarService.creatOneNavPath(
      {name:'Найпопулярніші гуртки', isActive: false, disable: true}
      )))
  }
  
  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }

  public SetCurrentView(view: string) {
    this.currentView = view;
    this.store.dispatch(new UpdateCurrentView(view));
  }
}
