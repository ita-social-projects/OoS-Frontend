import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Role } from 'shared/enum/role';
import { CreateCompetition, UpdateCompetition } from 'shared/store/provider.actions';
import { GetCompetitionById } from 'shared/store/shared-user.actions';
import { Competition } from 'shared/models/competition.model';
import { Judge } from 'shared/models/judge.model';
import { Provider } from 'shared/models/provider.model';
import { FormOfLearning } from 'shared/enum/workshop';
import { InstitutionTypes, OwnershipTypes } from 'shared/enum/provider';
import { LicenseStatuses, ProviderStatuses } from 'shared/enum/statuses';
import { Institution } from 'shared/models/institution.model';
import { Address } from 'shared/models/address.model';
import { Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CreateCompetitionComponent } from './create-competition.component';

describe('CreateCompetitionComponent', () => {
  let component: CreateCompetitionComponent;
  let fixture: ComponentFixture<CreateCompetitionComponent>;
  let router: Router;
  let store: Store;
  let navigationBarService: NavigationBarService;
  let activatedRoute: ActivatedRoute;
  let mockCompetitionId: string;

  const mockStore = {
    dispatch: jest.fn(),
    select: jest.fn(),
    selectSnapshot: jest.fn()
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: new Map([['id', '1']]) // Assuming an ID is present in the route
    }
  };

  const navigationBarServiceMock = {
    createNavPaths: jest.fn()
  };

  const routerMock = {
    navigate: jest.fn()
  };

  const sampleAddress: Address = {
    street: '123 Main St',
    id: 0,
    buildingNumber: '12',
    latitude: 13,
    longitude: 14,
    catottgId: 2
  };

  const sampleInstitution: Institution = {
    id: 'institution-id',
    title: 'main',
    numberOfHierarchyLevels: 10
  };

  const required = {
    id: '1',
    title: 'Competition Title',
    shortTitle: 'Short Title',
    competitionDateRangeGroup: {
      start: new Date('2025-01-01T00:00:00'),
      end: new Date('2025-01-02T00:00:00')
    },
    competitiveEventAccountingTypeId: 1,
    numberOfSeats: 100,
    judges: [],
    registrationDateRangeGroup: {
      start: new Date('2025-01-01T00:00:00'),
      end: new Date('2025-01-02T00:00:00')
    },
    parentCompetition: '',
    minimumAge: 18,
    maximumAge: 40,
    phone: '+380954356565',
    email: 'test@gmail.com'
  };

  const provider: Provider = {
    ownership: OwnershipTypes.Common,
    isBlocked: false,
    fullTitle: 'Sample Provider',
    shortTitle: 'SP',
    email: 'provider@test.com',
    edrpouIpn: '1234567890',
    director: 'John Doe',
    directorDateOfBirth: '1990-01-01',
    phoneNumber: '123-456-7890',
    founder: 'Jane Doe',
    status: ProviderStatuses.Approved,
    licenseStatus: LicenseStatuses.Approved,
    userId: 'user-id',
    legalAddress: sampleAddress,
    institution: sampleInstitution,
    institutionType: InstitutionTypes.Other,
    providerSectionItems: []
  };

  mockStore.select.mockReturnValue(of(provider));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCompetitionComponent],
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot()], // Mock any necessary modules
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NavigationBarService, useValue: navigationBarServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore template errors in testing
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCompetitionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    navigationBarService = TestBed.inject(NavigationBarService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mockCompetitionId = '1';

    component.RequiredFormGroup = new FormGroup({
      title: new FormControl(required.title),
      shortTitle: new FormControl(required.shortTitle),
      competitionDateRangeGroup: new FormGroup({
        start: new FormControl(required.competitionDateRangeGroup.start),
        end: new FormControl(required.competitionDateRangeGroup.end)
      }),
      minimumAge: new FormControl(required.minimumAge),
      maximumAge: new FormControl(required.maximumAge),
      registrationDateRangeGroup: new FormGroup({
        start: new FormControl(required.registrationDateRangeGroup.start),
        end: new FormControl(required.registrationDateRangeGroup.end)
      }),
      competitiveEventAccountingTypeId: new FormControl(required.competitiveEventAccountingTypeId),
      parentCompetitionControl: new FormControl(required.parentCompetition),
      numberOfSeats: new FormControl(required.numberOfSeats)
    });
    component.DescriptionFormGroup = new FormGroup({});
    component.JudgeFormArray = new FormArray([]);
    component.ContactsFormArray = new FormArray([]);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to competitions list on cancel', () => {
    const cancelSpy = jest.spyOn(router, 'navigate');

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalledWith(['/personal-cabinet/provider/competitions']);
  });
});
