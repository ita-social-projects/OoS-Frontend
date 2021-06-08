import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { NgxsModule } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MockOidcSecurityService } from '../../shared/mocks/mock-services';
import { Component } from '@angular/core';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        NgxsModule.forRoot([]),
        HttpClientTestingModule
      ],
      declarations: [MainComponent],
      providers: [
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
@Component({
  selector: 'app-category-card',
  template: ''
})
class MockCategoryCardComponent {
}
@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockWorkshopCardComponent {
}

