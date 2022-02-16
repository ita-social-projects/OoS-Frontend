
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { GetAllProviderAdmins } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

export interface ProviderAdmins {
  name: string;
  email: string;
  phone: string;
  role: string;
}

const DATA_MOCK: ProviderAdmins[] = [
  {name: 'Тестян Тест Тестович', email: 'test@gmail.com', phone: '1234567890', role: 'Адміністратор'}, 
  {name: 'Тестян3 Тест Тестович', email: 'test3@gmail.com', phone: '1234567890', role: 'Адміністратор'},
  {name: 'Тестян4 Тест Тестович', email: 'test4@gmail.com', phone: '1234567890', role: 'Заступник'},
  {name: 'Тестян5 Тест Тестович', email: 'test5@gmail.com', phone: '1234567890', role: 'Адміністратор'},
];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  @Select(UserState.providerAdmins)
  providerAdmins$: Observable<ProviderAdmins[]>;
  testAdmins: ProviderAdmins[];

  providerAdmins = DATA_MOCK;
  filterProviderAdmins: Array<object> = [];
  filter = new FormControl('');
  filterValue: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public store: Store) {}

  ngOnInit(): void {
    this.filter.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe((val) => {
        if (val) {
          this.filterValue = val;
        } else {
          this.filterValue = '';
        }
      });
    this.getAllProviderAdmins();
    
    this.providerAdmins$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((providerAdmins: ProviderAdmins[]) => this.testAdmins = providerAdmins);
  }

  getAllProviderAdmins(): void {
    this.store.dispatch(new GetAllProviderAdmins());
  }
  
  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.filterProviderAdmins = this.providerAdmins.filter(user => user.role === event.tab.textLabel);
    this.filter.reset();
    console.log(this.testAdmins[0]);
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
