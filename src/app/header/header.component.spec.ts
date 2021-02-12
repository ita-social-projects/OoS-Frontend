import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import { HeaderComponent } from './header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Component, Injectable } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { UserRegistrationState } from '../shared/store/user-registration.state';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatDialogModule,
        NgxsModule.forRoot([UserRegistrationState]),
        HttpClientModule
      ],
      declarations: [ HeaderComponent,
        MockRegistrationComponent
       ],
      providers:[
        {provide: OidcSecurityService, useClass: MockOidcSecurityService}
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
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-registration',
  template: ''
})
class MockRegistrationComponent{} 

@Injectable({
  providedIn: 'root'
})
class MockOidcSecurityService{} 