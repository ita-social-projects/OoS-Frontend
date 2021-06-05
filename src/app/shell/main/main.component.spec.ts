import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MockOidcSecurityService, MockStore } from '../../shared/mocks/mock-services';
import { RegistrationState } from '../../shared/store/registration.state';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ResultComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        NgxsModule.forRoot([RegistrationState]),
        HttpClientTestingModule
      ],
      declarations: [MainComponent],
      providers: [
        { provide: Store, useValue: MockStore },
        { provide: OidcSecurityService, useValue: MockOidcSecurityService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
