import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationCardComponent } from './application-card.component';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, LOCALE_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JoinPipe } from '../../../../../shared/pipes/join.pipe';
import { Child } from '../../../../../shared/models/child.model';
import { TextSliceTransformPipe } from '../../../../../shared/pipes/text-slice-transform.pipe';
import { StatusInfoCardComponent } from '../../../../../shared/components/status-info-card/status-info-card.component';
import { InfoStatusComponent } from './info-status/info-status.component';
import { PhoneTransformPipe } from '../../../../../shared/pipes/phone-transform.pipe';


describe('ApplicationCardComponent', () => {
  let component: ApplicationCardComponent;
  let fixture: ComponentFixture<ApplicationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatCardModule,
        RouterTestingModule,
        HttpClientModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatTooltipModule,
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'uk' },
        { provide: MatDialog, useValue: {} },
      ],
      declarations: [
        ApplicationCardComponent,
        StatusInfoCardComponent,
        InfoStatusComponent,
        MockChildInfoComponent,
        PhoneTransformPipe,
        JoinPipe,
        TextSliceTransformPipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-child-info-box',
  template: ''
})
class MockChildInfoComponent {
  @Input() child: Child;
}
