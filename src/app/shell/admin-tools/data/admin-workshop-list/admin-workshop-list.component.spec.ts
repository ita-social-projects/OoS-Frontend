import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { WorkshopFilterAdministration } from 'shared/models/workshop.model';
import { PaginationConstants } from 'shared/constants/constants';
import { Role } from 'shared/enum/role';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { GetFilteredWorkshopDrafts } from 'shared/store/admin.actions';
import { WorkshopListComponent } from 'shared/components/workshop-list/workshop-list.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'shared/shared.module';
import { BaseAdmin } from 'shared/models/admin.model';
import { AdminWorkshopListComponent } from './admin-workshop-list.component';

describe('AdminWorkshopListComponent', () => {
  let component: AdminWorkshopListComponent;
  let fixture: ComponentFixture<AdminWorkshopListComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), SharedModule, TranslateModule.forRoot()],
      declarations: [AdminWorkshopListComponent, WorkshopListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWorkshopListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'select').mockReturnValue(of({ data: [], total: 0 }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default filters for MinistryAdmin', () => {
    const workshopParameters: WorkshopFilterAdministration = {} as WorkshopFilterAdministration;
    const selectedAdmin = { institutionId: 123 } as any;

    component.setWorkshopsFiltersByDefault(workshopParameters, Role.ministryAdmin, selectedAdmin);

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

    component.setWorkshopsFiltersByDefault(workshopParameters, Role.regionAdmin, selectedAdmin);

    expect(workshopParameters.searchString).toBe('');
    expect(workshopParameters.size).toBe(PaginationConstants.TABLE_ITEMS_PER_PAGE);
    expect(workshopParameters.institutionId).toBe('456');
    expect(workshopParameters.catottgId).toBe(789);
  });

  it('should set default filters for  TechAdmin', () => {
    const workshopParameters: WorkshopFilterAdministration = {} as WorkshopFilterAdministration;
    const selectedAdmin: BaseAdmin = {} as BaseAdmin;

    component.setWorkshopsFiltersByDefault(workshopParameters, Role.techAdmin, selectedAdmin);

    expect(workshopParameters.searchString).toBe('');
    expect(workshopParameters.size).toBe(PaginationConstants.TABLE_ITEMS_PER_PAGE);
    expect(workshopParameters.institutionId).toBe('');
    expect(workshopParameters.catottgId).toBe(0);
  });

  it('should call store.dispatch after onGetWorkshopsByFilter', () => {
    const workshopParameters: WorkshopFilterAdministration = {
      searchString: 'test',
      size: 10,
      institutionId: '1',
      catottgId: 2
    };

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onGetWorkshopsByFilter(workshopParameters);

    expect(dispatchSpy).toHaveBeenCalledWith(new GetFilteredWorkshopDrafts(workshopParameters));
  });
});
