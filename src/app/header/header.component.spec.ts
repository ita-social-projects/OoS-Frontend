import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { NgxsModule, Store } from '@ngxs/store';
import { RegistrationState } from '../shared/store/registration.state';
import { MockStore } from '../shared/mocks/mock-services';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        MatIconModule,
        HttpClientModule,
        NgxsModule.forRoot([RegistrationState]),
      ],
      declarations: [
        HeaderComponent
      ],
      providers: [
        { provide: OidcSecurityService, useValue: MockOidcSecurityService },
        { provide: Store, useValue: MockStore }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Injectable({
  providedIn: 'root'
})

class MockOidcSecurityService {
  checkAuth: () => ({});
}
