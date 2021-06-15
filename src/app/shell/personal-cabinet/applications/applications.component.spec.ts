import { ApplicationSortPipe } from './../../../shared/pipes/application-sort.pipe';
import { ApplicationFilterPipe } from './../../../shared/pipes/application-filter.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationsComponent } from './applications.component';
import { NgxsModule, Store } from '@ngxs/store';
import { InfoBoxHostDirective } from '../../../shared/directives/info-box-host.directive';
import { Component, Input } from '@angular/core';
import { Application } from 'src/app/shared/models/application.model';
import { User } from 'src/app/shared/models/user.model';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatTabsModule
      ],
      declarations: [
        ApplicationsComponent,
        InfoBoxHostDirective,
        MockApplicationCardComponent,
        ApplicationFilterPipe,
        ApplicationSortPipe
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue({ role: '' } as User);

    fixture = TestBed.createComponent(ApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-application-card',
  template: ''
})
class MockApplicationCardComponent {
  @Input() application: Application;
}
