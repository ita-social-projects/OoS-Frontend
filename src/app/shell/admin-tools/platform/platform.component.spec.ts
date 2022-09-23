import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { PlatformComponent } from './platform.component';

describe('PlatformComponent', () => {
  let component: PlatformComponent;
  let fixture: ComponentFixture<PlatformComponent>;

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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PlatformComponent,
        MockRegulationsComponent,
        MockSupportComponent,
        MockAboutComponent,
        MockDirectionsComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-about-info',
  template: ''
})
class MockAboutComponent { }

@Component({
  selector: 'app-support-info',
  template: ''
})
class MockSupportComponent { }
@Component({
  selector: 'app-regulations-info',
  template: ''
})
class MockRegulationsComponent { }
@Component({
  selector: 'app-directions',
  template: ''
})
class MockDirectionsComponent { }

