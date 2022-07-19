import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidenavMenuComponent } from './sidenav-menu.component';
import { NgxsModule } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Component } from '@angular/core';

describe('SidenavComponent', () => {
  let component: SidenavMenuComponent;
  let fixture: ComponentFixture<SidenavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([]),
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        HttpClientModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        SidenavMenuComponent,
        MockSideNavNotificationsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-notifications',
  template: ''
})
class MockSideNavNotificationsComponent { }
