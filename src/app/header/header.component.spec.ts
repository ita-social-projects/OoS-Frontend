import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';
import { MockOidcSecurityService } from '../shared/mocks/mock-services';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        NgxsModule.forRoot([]),
        HttpClientModule,
        RouterTestingModule,
        MatMenuModule,
        MatSelectModule,
        MatProgressBarModule
      ],
      declarations: [
        HeaderComponent,
        MockSearchBarComponent,
        MockNavigationMobileBarComponent,
        MockNotificationsComponent,
        ProgressBarComponent
      ],
      providers: [{ provide: OidcSecurityService, useValue: MockOidcSecurityService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});

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
