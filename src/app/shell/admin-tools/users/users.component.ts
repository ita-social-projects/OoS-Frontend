import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { UserTabsUkr, UserTabsUkrReverse } from 'src/app/shared/enum/enumUA/tech-admin/users-tabs';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { ChildCards } from 'src/app/shared/models/child.model';
import { UsersTable } from 'src/app/shared/models/usersTable';
import { GetChildren } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { UserState } from 'src/app/shared/store/user.state';
import { Util } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(AdminState.children)
  children$: Observable<ChildCards>;

  readonly userRoleUkr = UserTabsUkr;
  readonly noUsers = NoResultsTitle.noUsers;

  filter = new FormControl('');
  filterValue: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;
  allUsers = [];
  parents = [];
  children: UsersTable[];

  constructor(
    public store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.filter.valueChanges
    .pipe(takeUntil(this.destroy$), debounceTime(200), distinctUntilChanged())
    .subscribe((val: string) => {
      if (val) {
        this.filterValue = val;
      } else {
        this.filterValue = '';
      }
    });

    this.children$.pipe(
      takeUntil(this.destroy$),
      filter((children: ChildCards) => !!children)
    ).subscribe((children: ChildCards) => {
      this.children = Util.updateStructureForTheTable(children.entities)
      this.allUsers = this.children;
    })

    // this.parents$.pipe(
    //   takeUntil(this.destroy$),
    //   filter((parents: Parent[]) => !!parents)
    // ).subscribe((parents: Parent[]) => this.parents = Util.updateStructureForTheTable(parents))
    // TODO: for the tab 'Батьки' will implement when backend will be ready

    // this.parents$.pipe(
    //   takeUntil(this.destroy$),
    //   filter((parents: Parent[]) => !!parents),
    //   combineLatestWith(this.children$),
    // ).subscribe(users => this.allUsers = Util.updateStructureForTheTable(users))
    // this.store.dispatch(new GetParents());
    // TODO: for the tab 'Усі' will implement when backend will be ready    

    this.store.dispatch(new GetChildren());
  }
  
  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
   onTabChange(event: MatTabChangeEvent): void {
    this.filter.reset();
    this.router.navigate(
      ['../', UserTabsUkrReverse[event.tab.textLabel]],
      { relativeTo: this.route }
    );
  }
}

