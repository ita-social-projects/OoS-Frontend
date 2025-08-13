import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ENTER } from '@angular/cdk/keycodes';
import { StsConfigLoader } from 'angular-auth-oidc-client';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { StsConfigLoader } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

import { Role } from 'shared/enum/role';
import { CompetitionDraftCard, CompetitionProviderViewCard } from 'shared/models/competition.model';
import { CompetitionProviderViewCard } from 'shared/models/competition.model';
import { CompetitionStatus, FormOfLearning } from 'shared/enum/competition';
import { RegistrationState } from 'shared/store/registration.state';
import { GetCompetitionDraftIdByCompetitionId } from 'shared/store/provider.actions';
import { CompetitionCardComponent } from './competition-card.component';

describe('CompetitionCardComponent', () => {
  let component: CompetitionCardComponent;
  let fixture: ComponentFixture<CompetitionCardComponent>;
  let storeMock: any;

  beforeEach(() => {
    storeMock = {
      select: jest.fn().mockReturnValue(of(Role.parent)),
      dispatch: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: storeMock }, StsConfigLoader],
      declarations: [CompetitionCardComponent],
      imports: [NgxsModule.forRoot([RegistrationState], { developmentMode: true }), HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompetitionCardComponent);
    component = fixture.componentInstance;
    component.competitionData = {
      amountOfPendingApplications: 0,
      unreadMessages: 0,
      numberOfOccupiedSeats: 0,
      numberOfSeats: 2,
      state: CompetitionStatus.Draft,
      id: '1',
      plannedFormatOfClasses: FormOfLearning.Offline,
      title: 'Math',
      institutionHierarchy: '',
      institutionHierarchyId: '',
      scheduledEndTime: '',
      scheduledStartTime: '',
      minimumAge: 0,
      maximumAge: 12,
      competitiveSelection: false,
      price: 0,
      rating: 0,
      numberOfRatings: 0
    };
    fixture.detectChanges();
  });
  it('it should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set competition data', () => {
    const competition: CompetitionProviderViewCard = { amountOfPendingApplications: 0, unreadMessages: 0 } as any;

    component.competition = competition;

    expect(component.competitionData).toEqual(competition);
  });

  it('should emit delete event', () => {
    jest.spyOn(component.deleteCompetition, 'emit');
    component.competitionData = { amountOfPendingApplications: 0, unreadMessages: 0 } as any;

    component.onDelete();

    expect(component.deleteCompetition.emit).toHaveBeenCalledWith(component.competitionData);
  });

  describe('onEdit', () => {
    it('should navigate directly if workshopDraftId provided', () => {
      const mockRouter = TestBed.inject(Router);
      jest.spyOn(mockRouter, 'navigate');
      component.onEdit('111');
      expect(storeMock.dispatch).not.toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['create/competition/draft', '111']);
    });

    it('should dispatch check for workshopDraftId if workshopDraftId is not provided', () => {
      component.competitionData = {
        id: '111'
      } as CompetitionDraftCard;
      component.onEdit(undefined);
      expect(storeMock.dispatch).toHaveBeenCalledWith(new GetCompetitionDraftIdByCompetitionId('111'));
    });
  });

  it('keydown', () => {
    const keyboardEvent = new KeyboardEvent('keydown', {
      keyCode: ENTER
    });

    jest.spyOn(component, 'onEdit');
    jest.spyOn(component, 'onDelete');

    component.onEditKeydown(keyboardEvent, '111');
    expect(component.onEdit).toHaveBeenCalled();

    component.onDeleteKeydown(keyboardEvent);
    expect(component.onDelete).toHaveBeenCalled();
  });

  it('coverImage error', () => {
    component.onImageError();
    expect(component.isImageBroken).toBeTruthy();

    expect(component.competitionData._meta).toEqual('assets/images/groupimages/workshop-img.png');
  });
});
