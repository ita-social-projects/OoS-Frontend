import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { GetAllInstitutions, GetCodeficatorSearch, GetCodeficatorById } from 'shared/store/meta-data.actions';
import { Role } from 'shared/enum/role';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { SharedModule } from 'shared/shared.module';
import { WorkshopListComponent } from './workshop-list.component';

describe('WorkshopInfoComponent', () => {
  let component: WorkshopListComponent;
  let fixture: ComponentFixture<WorkshopListComponent>;
  let storeMock: jest.Mocked<Store>;

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
      imports: [NgxsModule.forRoot([]), RouterTestingModule, TranslateModule.forRoot(), SharedModule],
      declarations: [WorkshopListComponent],
      providers: [{ provide: Store, useValue: storeMock }]
    });

    fixture = TestBed.createComponent(WorkshopListComponent);
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
});
