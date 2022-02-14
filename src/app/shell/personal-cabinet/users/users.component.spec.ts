import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxsModule} from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,

      ],
      declarations: [
        UsersComponent,
        MockUsersListComponent
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-users-list',
  template: ''
})
class MockUsersListComponent {
  @Input() users: Array<object>;
  @Input() filterValue: string;
}
