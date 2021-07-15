import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopsComponent } from './workshops.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../../shared/models/workshop.model';
import { User } from '../../../shared/models/user.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Application } from 'src/app/shared/models/application.model';
import { ApplicationFilterPipe } from 'src/app/shared/pipes/application-filter.pipe';
import { ApplicationChildFilterPipe } from 'src/app/shared/pipes/application-child-filter.pipe';

describe('WorkshopsComponent', () => {
  let component: WorkshopsComponent;
  let fixture: ComponentFixture<WorkshopsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([]),
        MatDialogModule,
        MatTabsModule
      ],
      declarations: [
        WorkshopsComponent,
        MockWorkshopCardComponent,
        ApplicationFilterPipe,
        ApplicationChildFilterPipe,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue({ role: '' } as User);

    fixture = TestBed.createComponent(WorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isMainPage: boolean;
  @Input() userRole: string;
  @Input() application: Application;
}
