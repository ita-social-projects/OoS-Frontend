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
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { Role } from 'shared/enum/role';
import { MockOidcSecurityService } from 'shared/mocks/mock-services';
import { MainPageStateModel } from 'shared/store/main-page.state';
import { NavStateModel } from 'shared/store/navigation.state';
import { RegistrationStateModel } from 'shared/store/registration.state';
import { HeaderComponent } from './header.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

const MockUser = {
  role: ''
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onViewChange method', () => {
    jest.spyOn(component, 'onViewChange');

    component.onViewChange();

    expect(component.onViewChange).toHaveBeenCalled();
  });

  it('should call onLogin method', () => {
    jest.spyOn(component, 'onLogin');

    component.onLogin();

    expect(component.onLogin).toHaveBeenCalled();
  });

  it('should call onLogout method', () => {
    jest.spyOn(component, 'onLogout');

    component.onLogout();

    expect(component.onLogout).toHaveBeenCalled();
  });

  it('should call setLanguage method', () => {
    jest.spyOn(component, 'setLanguage');

    component.setLanguage();

    expect(component.setLanguage).toHaveBeenCalled();
  });
});

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    subrole: Role.all,
    isAuthorized: false,
    isLoading: false,
    isAuthorizationLoading: true,
    user: {
      dateOfBirth: '',
      isRegistered: false,
      lastName: '',
      firstName: '',
      id: '',
      role: ''
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
