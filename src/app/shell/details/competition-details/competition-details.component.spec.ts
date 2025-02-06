import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { ImageCarouselComponent } from 'shared/components/image-carousel/image-carousel.component';
import { Role } from 'shared/enum/role';
import { Provider } from 'shared/models/provider.model';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Constants } from 'shared/constants/constants';
import { of } from 'rxjs';
import { Competition } from 'shared/models/competition.model';
import { Judge } from 'shared/models/judge.model';
import { CompetitionDetailsComponent } from './competition-details.component';

describe('CompetitionDetailsComponent', () => {
  let component: CompetitionDetailsComponent;
  let fixture: ComponentFixture<CompetitionDetailsComponent>;
  let expectingMatDialogData: object;
  let matDialog: MatDialog;
  let matDialogSpy: jest.SpyInstance;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatTabsModule,
        RouterTestingModule,
        MatIconModule,
        MatChipsModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        MatDialogModule
      ],
      declarations: [
        CompetitionDetailsComponent,
        MockCompetitionJudgesComponent,
        MockCompetitionAboutComponent,
        ImageCarouselComponent,
        MockActionsComponent,
        ConfirmationModalWindowComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionDetailsComponent);
    component = fixture.componentInstance;
    component.competition = {} as Competition;
    component.provider = {} as Provider;
    matDialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open confirmation dialog and dispatch PublishWorkshop on confirm', () => {
    expectingMatDialogData = {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.publishCompetition
      }
    };
    matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<ConfirmationModalWindowComponent>);
    component.onActionButtonClick(ModalConfirmationType.publishCompetition);
    expect(matDialogSpy).toHaveBeenCalledTimes(1);
    expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectingMatDialogData);
  });
});
@Component({
  selector: 'app-competition-about',
  template: ''
})
class MockCompetitionAboutComponent {
  @Input() competition: Competition;
}

@Component({
  selector: 'app-competition-judges',
  template: ''
})
class MockCompetitionJudgesComponent {
  @Input() judges: Judge[];
}

@Component({
  selector: 'app-actions',
  template: ''
})
class MockActionsComponent {
  @Input() role: Role;
  @Input() competition: Competition;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;
}
