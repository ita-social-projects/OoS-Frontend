import { HttpClientModule } from '@angular/common/http';
import { Component, Input, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { StatusInfoCardComponent } from 'shared/components/status-info-card/status-info-card.component';
import { Child } from 'shared/models/child.model';
import { JoinPipe } from 'shared/pipes/join.pipe';
import { PhonePipe } from 'shared/pipes/phone.pipe';
import { TextSliceTransformPipe } from 'shared/pipes/text-slice-transform.pipe';
import { TranslateCasesPipe } from 'shared/pipes/translate-cases.pipe';
import { ApplicationCardComponent } from './application-card.component';
import { InfoStatusComponent } from './info-status/info-status.component';

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
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'uk' },
        { provide: MatDialog, useValue: {} }
      ],
      declarations: [
        ApplicationCardComponent,
        StatusInfoCardComponent,
        InfoStatusComponent,
        MockChildInfoComponent,
        PhonePipe,
        JoinPipe,
        TextSliceTransformPipe,
        TranslateCasesPipe
      ]
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
