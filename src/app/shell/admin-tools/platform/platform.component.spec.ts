import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { of } from 'rxjs';
import { AdminTabsTitlesParams } from 'shared/enum/admins';
import { PlatformComponent } from './platform.component';

describe('PlatformComponent', () => {
  let component: PlatformComponent;
  let fixture: ComponentFixture<PlatformComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule,
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [PlatformComponent, MockRegulationsComponent, MockSupportComponent, MockAboutComponent, MockDirectionsComponent],
      providers: [{ provide: ActivatedRoute, useValue: { queryParams: of({ page: AdminTabsTitlesParams.MainPage }) } }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to correct tab link when tab selected', () => {
    jest.spyOn(router, 'navigate');
    const index = 2;
    const expectedPage = AdminTabsTitlesParams[index];

    component.onSelectedTabChange({ index } as MatTabChangeEvent);

    expect(router.navigate).toHaveBeenCalledWith(['admin-tools/platform'], { queryParams: { page: expectedPage } });
  });
});

@Component({
  selector: 'app-about-info',
  template: ''
})
class MockAboutComponent {}

@Component({
  selector: 'app-support-info',
  template: ''
})
class MockSupportComponent {}

@Component({
  selector: 'app-regulations-info',
  template: ''
})
class MockRegulationsComponent {}

@Component({
  selector: 'app-directions',
  template: ''
})
class MockDirectionsComponent {}
