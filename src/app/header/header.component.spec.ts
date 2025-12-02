import { HttpClientModule } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { Role } from 'shared/enum/role';
import { MockOidcSecurityService } from 'shared/mocks/mock-services';
import { MainPageStateModel } from 'shared/store/main-page.state';
import { SidenavToggle } from 'shared/store/navigation.actions';
import { NavStateModel } from 'shared/store/navigation.state';
import { Login, Logout } from 'shared/store/registration.actions';
import { RegistrationStateModel } from 'shared/store/registration.state';
import { HeaderComponent } from './header.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: Store;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        NgxsModule.forRoot([MockRegistrationState, MockNavigationState, MockMainPageState]),
        HttpClientModule,
        RouterTestingModule,
        MatMenuModule,
        MatSelectModule,
        MatProgressBarModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        HeaderComponent,
        MockSearchBarComponent,
        MockNavigationMobileBarComponent,
        MockNotificationsComponent,
        ProgressBarComponent
      ],
      providers: [{ provide: OidcSecurityService, useValue: MockOidcSecurityService }, DateAdapter, Store]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch SidenavToggle action after onViewChange method call', () => {
    jest.spyOn(store, 'dispatch');

    component.onViewChange();

    expect(store.dispatch).toHaveBeenCalledWith(new SidenavToggle());
  });

  it('should dispatch Login action after onLogin method call', () => {
    jest.spyOn(store, 'dispatch');

    component.onLogin();

    expect(store.dispatch).toHaveBeenCalledWith(new Login(false));
  });

  it('should dispatch Logout action after onLogout method call', () => {
    jest.spyOn(store, 'dispatch');

    component.onLogout();

    expect(store.dispatch).toHaveBeenCalledWith(new Logout());
  });

  it('should change translate language and put locale into localStorage after setLanguage method call', () => {
    component.selectedLanguage = 'en';
    component.setLanguage();

    expect(translate.currentLang).toEqual(component.selectedLanguage);
    expect(localStorage.getItem('ui-culture')).toEqual(component.selectedLanguage);
  });
});

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    isAuthorized: false,
    isLoading: false,
    isAuthorizationLoading: true,
    user: {
      dateOfBirth: '',
      isRegistered: false,
      lastName: '',
      firstName: '',
      id: '',
      role: '',
      isBlocked: false,
      emailConfirmed: false
    },
    provider: undefined,
    parent: undefined,
    techAdmin: undefined,
    ministryAdmin: undefined,
    regionAdmin: undefined,
    areaAdmin: undefined,
    role: Role.provider
  }
})
@Injectable()
class MockRegistrationState {}

@State<NavStateModel>({
  name: 'navigation',
  defaults: {
    navigation: [{ disable: false, name: '', isActive: false }],
    sidenavOpen: false,
    filtersSidenavOpen: false
  }
})
@Injectable()
class MockNavigationState {}

@State<MainPageStateModel>({
  name: 'mainPage',
  defaults: {
    isLoadingData: false,
    headerInfo: { companyInformationItems: [] },
    topWorkshops: null,
    topDirections: null
  }
})
@Injectable()
class MockMainPageState {}

@Component({
  selector: 'app-full-search-bar',
  template: ''
})
class MockSearchBarComponent {}

@Component({
  selector: 'app-navigation-mobile-bar',
  template: ''
})
class MockNavigationMobileBarComponent {}

@Component({
  selector: 'app-notifications',
  template: ''
})
class MockNotificationsComponent {}
