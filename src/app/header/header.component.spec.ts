import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Component, Injectable } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { RegistrationState } from '../shared/store/registration.state';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
\import { MockOidcSecurityService } from '../shared/mocks/mock-services';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatDialogModule,
        NgxsModule.forRoot([RegistrationState]),
        HttpClientModule
      ],
      declarations: [
        HeaderComponent
      ],
      providers: [
        { provide: OidcSecurityService, useValue: MockOidcSecurityService },
      ]
    })
      .compileComponents();
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
