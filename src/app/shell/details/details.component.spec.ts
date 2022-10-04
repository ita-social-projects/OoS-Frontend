import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { NgxsModule, Store } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../shared/models/workshop.model';
import { User } from '../../shared/models/user.model';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { of } from 'rxjs';
import { Provider } from '../../shared/models/provider.model';
import { Role } from '../../shared/enum/role';

const MockUser = {
  role: '',
};

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterModule.forRoot([]),
        FlexLayoutModule
      ],
      declarations: [
        DetailsComponent,
        MockSideMenuComponent,
        MockDetailsWorkshopComponent,
        MockDetailsProviderComponent,
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of(MockUser as User));

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-workshop-details',
  template: ''
})
class MockDetailsWorkshopComponent {
  @Input() role: Role;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;
}
@Component({
  selector: 'app-provider-details',
  template: ''
})
class MockDetailsProviderComponent {
  @Input() role: Role;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;
}
@Component({
  selector: 'app-side-menu',
  template: ''
})
class MockSideMenuComponent {
  @Input() role: Role;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;
}
