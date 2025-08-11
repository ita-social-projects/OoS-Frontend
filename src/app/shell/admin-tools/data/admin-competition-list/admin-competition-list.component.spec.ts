import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { PaginationConstants } from 'shared/constants/constants';
import { Role } from 'shared/enum/role';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { GetFilteredCompetitionDrafts } from 'shared/store/admin.actions';
import { SharedModule } from 'shared/shared.module';
import { BaseAdmin } from 'shared/models/admin.model';
import { CompetitionFilterAdministration } from 'shared/models/competition.model';
import { AdminCompetitionListComponent } from './admin-competition-list.component';

describe('AdminCompetitionListComponent', () => {
  let component: AdminCompetitionListComponent;
  let fixture: ComponentFixture<AdminCompetitionListComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), SharedModule, TranslateModule.forRoot(), BrowserAnimationsModule],
      declarations: [AdminCompetitionListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCompetitionListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'select').mockReturnValue(of({ data: [], total: 0 }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default filters for MinistryAdmin', () => {
    const competitionParameters: CompetitionFilterAdministration = {} as CompetitionFilterAdministration;
    const selectedAdmin = { institutionId: 123 } as any;

    component.setCompetitionEventFiltersByDefault(competitionParameters, Role.ministryAdmin, selectedAdmin);

    expect(competitionParameters.searchString).toBe('');
    expect(competitionParameters.size).toBe(PaginationConstants.TABLE_ITEMS_PER_PAGE);
    expect(competitionParameters.institutionId).toBe(123);
    expect(competitionParameters.catottgId).toBe(0);
  });

  it('should set default filters for Region and Area Admins', () => {
    const competitionParameters: CompetitionFilterAdministration = {} as CompetitionFilterAdministration;
    const selectedAdmin: RegionAdmin = {
      institutionId: '456',
      catottgId: 789,
      catottgName: 'Test Name',
      email: 'test@example.com',
      phoneNumber: '123456789',
      lastName: 'Test',
      firstName: 'Test'
    };

    component.setCompetitionEventFiltersByDefault(competitionParameters, Role.regionAdmin, selectedAdmin);

    expect(competitionParameters.searchString).toBe('');
    expect(competitionParameters.size).toBe(PaginationConstants.TABLE_ITEMS_PER_PAGE);
    expect(competitionParameters.institutionId).toBe('456');
    expect(competitionParameters.catottgId).toBe(789);
  });

  it('should set default filters for TechAdmin', () => {
    const competitionParameters: CompetitionFilterAdministration = {} as CompetitionFilterAdministration;
    const selectedAdmin: BaseAdmin = {} as BaseAdmin;

    component.setCompetitionEventFiltersByDefault(competitionParameters, Role.techAdmin, selectedAdmin);

    expect(competitionParameters.searchString).toBe('');
    expect(competitionParameters.size).toBe(PaginationConstants.TABLE_ITEMS_PER_PAGE);
    expect(competitionParameters.institutionId).toBe('');
    expect(competitionParameters.catottgId).toBe(0);
  });

  it('should call store.dispatch after onGetCompetitionEventsByFilter', () => {
    const competitionParameters: CompetitionFilterAdministration = {
      searchString: 'test',
      size: 10,
      institutionId: '1',
      catottgId: 2
    };

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onGetCompetitionEventsByFilter(competitionParameters);

    expect(dispatchSpy).toHaveBeenCalledWith(new GetFilteredCompetitionDrafts(competitionParameters));
  });
});
