
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';

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
export class UsersComponent implements OnInit {

  providerAdmins = DATA_MOCK;
  filterProviderAdmins: Array<object> = [];
  filterValue: string;


  constructor() {}

  ngOnInit(): void {
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.filterProviderAdmins = this.providerAdmins.filter(user => user.role === event.tab.textLabel);
    this.filterValue = '';
  }

  /**
   * This method get search input value
   * @param event: Event
   */
  onSearch(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
  }
}
