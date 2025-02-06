import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Role } from 'shared/enum/role';
import { NgxsModule, Store } from '@ngxs/store';
import { CompetitionProviderViewCard } from 'shared/models/competition.model';
import { CompetitionStatus, FormOfLearning } from 'shared/enum/competition';
import { RegistrationState } from 'shared/store/registration.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StsConfigLoader } from 'angular-auth-oidc-client';
import { TranslateModule } from '@ngx-translate/core';
import { CompetitionCardComponent } from './competition-card.component';

describe('CompetitionCardComponent', () => {
  let component: CompetitionCardComponent;
  let fixture: ComponentFixture<CompetitionCardComponent>;
  let storeMock: any;

  beforeEach(() => {
    storeMock = {
      select: jest.fn().mockReturnValue(of(Role.parent))
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
      withDisabilityOptions: false,
      rating: 0,
      numberOfRatings: 0,
      directionIds: []
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
});
