import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationCardComponent } from './application-card.component';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StatusInfoCardComponent } from 'src/app/shared/components/status-info-card/status-info-card.component';
import { MatMenuModule } from '@angular/material/menu';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfoStatusComponent } from 'src/app/shell/personal-cabinet/shared-cabinet/applications/application-card/info-status/info-status.component';
import { ChildInfoBoxComponent } from 'src/app/shell/personal-cabinet/shared-cabinet/applications/application-card/child-info-box/child-info-box.component';
import { PhoneTransformPipe } from 'src/app/shared/pipes/phone-transform.pipe';

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
        {provide: MatDialog, useValue: {}}
      ],
      declarations: [
        ApplicationCardComponent,
        StatusInfoCardComponent,
        InfoStatusComponent,
        ChildInfoBoxComponent,
        PhoneTransformPipe]

    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
