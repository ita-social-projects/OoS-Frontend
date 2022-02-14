
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

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

  providerAdmins = DATA_MOCK;
  filterProviderAdmins: Array<object> = [];
  filter = new FormControl('');
  filterValue: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

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
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.filterProviderAdmins = this.providerAdmins.filter(user => user.role === event.tab.textLabel);
    this.filter.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
