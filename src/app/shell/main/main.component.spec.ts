import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { NgxsModule } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MockOidcSecurityService } from '../../shared/mocks/mock-services';
import { Component, Input } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import { RouterTestingModule } from '@angular/router/testing';
import { Workshop } from '../../shared/models/workshop.model';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        NgxsModule.forRoot([]),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        MainComponent,
        MockMainCategoryCardComponent,
        MockMainWorkshopCardComponent
      ],
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
class MockMainCategoryCardComponent {
  @Input() category: Category;
  @Input() icons: {};
}

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockMainWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isMainPage: boolean;
  @Input() userRole: string;
}
