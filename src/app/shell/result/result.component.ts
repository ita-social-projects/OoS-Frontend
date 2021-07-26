import { Component, OnInit, OnDestroy } from '@angular/core';
import { UpdateCurrentView } from '../../shared/result.actions';
import { Select, Store } from '@ngxs/store';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AppState } from 'src/app/shared/store/app.state';
import { Observable } from 'rxjs';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';
import { GetFilteredWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {

  @Select(FilterState.filteredWorkshops) filteredWorkshops$: Observable<WorkshopCard[]>;

  public currentView: string;
  isFiltersVisible: boolean = true;

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService,
  ) { }

  ngOnInit(): void {
    this.currentView = 'show-data';
    this.store.dispatch([
      // new AddNavPath(this.navigationBarService.creatOneNavPath(
      //   { name: NavBarName.TopWorkshops, isActive: false, disable: true }
      // )),
      new GetFilteredWorkshops()]
    );
  }

  public SetCurrentView(view: string) {
    this.currentView = view;
    this.store.dispatch(new UpdateCurrentView(view));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
