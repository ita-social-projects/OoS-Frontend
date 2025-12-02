import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of } from 'rxjs';
import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { Role } from 'shared/enum/role';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { GetAllInstitutions, GetCodeficatorSearch, GetCodeficatorById } from 'shared/store/meta-data.actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store, NgxsModule } from '@ngxs/store';
import { SharedModule } from 'shared/shared.module';
import { WorkshopFilterAdministration } from 'shared/models/workshop.model';
import { PaginationConstants } from 'shared/constants/constants';
import { BaseAdmin } from 'shared/models/admin.model';
import { DraftFiltersComponent } from './draft-filters.component';

describe('DraftFiltersComponent', () => {
  let component: DraftFiltersComponent;
  let fixture: ComponentFixture<DraftFiltersComponent>;

  let storeMock: any;
  beforeEach(() => {
    storeMock = {
      dispatch: jest.fn().mockReturnValue(
        of({
          metaDataState: {
            codeficatorSearch: [{ id: 'id', category: CodeficatorCategories.Level1 }],
            codeficator: { region: 'someValue' }
          }
        })
      ),
      select: jest.fn().mockReturnValue(of('mockedRole'))
    } as unknown as jest.Mocked<Store>;

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), SharedModule, BrowserAnimationsModule],
      declarations: [],
      providers: [{ provide: Store, useValue: storeMock }, provideRouter([])]
    });

    fixture = TestBed.createComponent(DraftFiltersComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetAllInstitutions if isTechAdmin is true', () => {
    component.role = Role.techAdmin;

    (component as any).setInformationDependingOnRole();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new GetAllInstitutions(true));
  });

  it('should dispatch GetCodeficatorSearch and disable areaFormControl if isTechAdmin or isMinistryAdmin', fakeAsync(() => {
    component.role = Role.ministryAdmin;
    jest.spyOn(component as any, 'areaFormControl', 'get').mockReturnValue({ disable: jest.fn() });

    (component as any).setInformationDependingOnRole();
    tick();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new GetCodeficatorSearch('', [CodeficatorCategories.Level1]));
    expect((component as any).areaFormControl.disable).toHaveBeenCalled();
  }));

  it('should handle isRegionAdmin correctly and dispatch GetCodeficatorById', fakeAsync(() => {
    component.role = Role.regionAdmin;
    jest.spyOn(component, 'selectedAdmin$', 'get').mockReturnValue(of({ catottgId: 123, catottgName: '1234' } as RegionAdmin));

    (component as any).setInformationDependingOnRole();
    tick();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new GetCodeficatorById(123));
    expect(storeMock.dispatch).toHaveBeenCalledWith(new GetCodeficatorSearch('someValue', [CodeficatorCategories.Level1]));
  }));

  it('should set default filters for MinistryAdmin', () => {
    const workshopParameters: WorkshopFilterAdministration = {} as WorkshopFilterAdministration;
    const selectedAdmin = { institutionId: 123 } as any;

    component.setFiltersByDefault(workshopParameters, Role.ministryAdmin, selectedAdmin);

    expect(workshopParameters.searchString).toBe('');
    expect(workshopParameters.size).toBe(PaginationConstants.TABLE_ITEMS_PER_PAGE);
    expect(workshopParameters.institutionId).toBe(123);
    expect(workshopParameters.catottgId).toBe(0);
  });

  it('should set default filters for Region and Area Admins', () => {
    const workshopParameters: WorkshopFilterAdministration = {} as WorkshopFilterAdministration;
    const selectedAdmin: RegionAdmin = {
      institutionId: '456',
      catottgId: 789,
      catottgName: 'Test Name',
      email: 'test@example.com',
      phoneNumber: '123456789',
      lastName: 'Test',
      firstName: 'Test'
    };

    component.setFiltersByDefault(workshopParameters, Role.regionAdmin, selectedAdmin);

    expect(workshopParameters.searchString).toBe('');
    expect(workshopParameters.size).toBe(PaginationConstants.TABLE_ITEMS_PER_PAGE);
    expect(workshopParameters.institutionId).toBe('456');
    expect(workshopParameters.catottgId).toBe(789);
  });

  it('should set default filters for TechAdmin', () => {
    const workshopParameters: WorkshopFilterAdministration = {} as WorkshopFilterAdministration;
    const selectedAdmin: BaseAdmin = {} as BaseAdmin;

    component.setFiltersByDefault(workshopParameters, Role.techAdmin, selectedAdmin);

    expect(workshopParameters.searchString).toBe('');
    expect(workshopParameters.size).toBe(PaginationConstants.TABLE_ITEMS_PER_PAGE);
    expect(workshopParameters.institutionId).toBe('');
    expect(workshopParameters.catottgId).toBe(0);
  });
});
