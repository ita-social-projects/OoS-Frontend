import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { UserTabsUkr, UserTabsUkrReverse } from 'src/app/shared/enum/enumUA/tech-admin/users-tabs';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  readonly userRoleUkr = UserTabsUkr;
  readonly noUsers = NoResultsTitle.noUsers;

  filter = new FormControl('');
  filterValue: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;
  allUsers = [];
  parents = [];
  children = [];

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
