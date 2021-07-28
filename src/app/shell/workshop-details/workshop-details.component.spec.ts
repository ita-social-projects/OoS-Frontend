import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopDetailsComponent } from './workshop-details.component';
import { NgxsModule, Store } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../shared/models/workshop.model';
import { User } from '../../shared/models/user.model';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { Provider } from 'src/app/shared/models/provider.model';

const MockUser = {
  role: '',
};

describe('WorkshopDetailsComponent', () => {
  let component: WorkshopDetailsComponent;
  let fixture: ComponentFixture<WorkshopDetailsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterModule.forRoot([]),
      ],
      declarations: [
        WorkshopDetailsComponent,
        MockSideMenuComponent,
        MockWorkshopPageComponent
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue(MockUser as User);

    fixture = TestBed.createComponent(WorkshopDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-workshop-page',
  template: ''
})
class MockWorkshopPageComponent {
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() providerWorkshops: Workshop[];
  @Input() isDisplayedforProvider: boolean;
  @Input() isRegistered: boolean;
}

@Component({
  selector: 'app-side-menu',
  template: ''
})
class MockSideMenuComponent {
  @Input() workshop: Workshop;
  @Input() isDisplayedforProvider: boolean;
  @Input() isRegistered: boolean;
}
