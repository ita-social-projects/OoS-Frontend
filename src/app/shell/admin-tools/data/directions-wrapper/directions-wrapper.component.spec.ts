import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { DirectionsWrapperComponent } from './directions-wrapper.component';
import { DirectionsComponent } from './directions/directions.component';

describe('DirectionsWrapperComponent', () => {
  let component: DirectionsWrapperComponent;
  let fixture: ComponentFixture<DirectionsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatTabsModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [DirectionsWrapperComponent, DirectionsComponent, MockNoResultCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DirectionsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-no-result-card',
  template: ''
})
class MockNoResultCardComponent {
  @Input() public title: string;
}
