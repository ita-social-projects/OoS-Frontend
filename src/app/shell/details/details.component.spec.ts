import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { Workshop } from '../../shared/models/workshop.model';
import { Provider } from '../../shared/models/provider.model';
import { Role } from '../../shared/enum/role';
import { DetailsComponent } from './details.component';

const MockUser = {
  role: ''
};

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), RouterModule.forRoot([])],
      declarations: [DetailsComponent, MockSideMenuComponent, MockDetailsWorkshopComponent, MockDetailsProviderComponent],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of(MockUser as User));

    window.scrollTo = jest.fn();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});

@Component({
  selector: 'app-workshop-details',
  template: ''
})
class MockDetailsWorkshopComponent {
  @Input() public role: Role;
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;
  @Input() public isMobileScreen: boolean;
  @Input() public displayActionCard: boolean;
}
@Component({
  selector: 'app-provider-details',
  template: ''
})
class MockDetailsProviderComponent {
  @Input() public role: Role;
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;
  @Input() public isMobileScreen: boolean;
  @Input() public displayActionCard: boolean;
}
@Component({
  selector: 'app-side-menu',
  template: ''
})
class MockSideMenuComponent {
  @Input() public role: Role;
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;
  @Input() public isMobileScreen: boolean;
  @Input() public displayActionCard: boolean;
}
