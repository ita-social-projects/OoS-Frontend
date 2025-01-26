import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { Role } from 'shared/enum/role';
import { MockOidcSecurityService } from 'shared/mocks/mock-services';
import { Direction } from 'shared/models/category.model';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { FilterStateModel } from 'shared/models/filter-state.model';
import { Workshop } from 'shared/models/workshop.model';
import { ParentStateModel } from 'shared/store/parent.state';
import { Login } from 'shared/store/registration.actions';
import { RegistrationStateModel } from 'shared/store/registration.state';
import { FooterComponent } from '../../footer/footer.component';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        NgxsModule.forRoot([MockRegistrationState, MockFilterState, MockParentState]),
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [MainComponent, FooterComponent, MockMainCategoryCardComponent, MockMainWorkshopCardComponent],
      providers: [{ provide: OidcSecurityService, useValue: MockOidcSecurityService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onRegister and dispatch Login after click register button', () => {
    jest.spyOn(component, 'onRegister');
    jest.spyOn(store, 'dispatch');
    const button = fixture.debugElement.query(By.css('[data-testid="register-button"]'));

    button.nativeElement.click();

    expect(component.onRegister).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new Login(true));
  });
});

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    isAuthorized: false,
    isLoading: false,
    isAuthorizationLoading: false,
    user: undefined,
    provider: undefined,
    parent: undefined,
    techAdmin: undefined,
    ministryAdmin: undefined,
    regionAdmin: undefined,
    areaAdmin: undefined,
    role: Role.unauthorized
  }
})
@Injectable()
class MockRegistrationState {}

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    ...new DefaultFilterState(),
    settlement: {
      id: 0,
      region: '',
      category: CodeficatorCategories.Region,
      territorialCommunity: '',
      settlement: '',
      cityDistrict: '',
      latitude: 0,
      longitude: 0,
      fullName: ''
    },
    filteredWorkshops: null,
    isLoading: false,
    isConfirmCity: false,
    mapViewCoords: null,
    userRadiusSize: null,
    isMapView: false,
    from: null,
    size: null
  }
})
@Injectable()
class MockFilterState {}

@State<ParentStateModel>({
  name: 'parent',
  defaults: {
    isLoading: false,
    isAllowChildToApply: true,
    isAllowedToReview: false,
    isReviewed: false,
    favoriteWorkshops: [
      {
        workshopId: 'test'
      }
    ],
    favoriteWorkshopsCard: null,
    children: null,
    truncatedItems: null,
    selectedChild: null
  }
})
@Injectable()
class MockParentState {}

@Component({
  selector: 'app-category-card',
  template: ''
})
class MockMainCategoryCardComponent {
  @Input() direction: Direction;
  @Input() workshopsCount: number;
  @Input() icons: {};
}

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockMainWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isCreateFormView: boolean;
}
