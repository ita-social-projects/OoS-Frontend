import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { Workshop } from 'shared/models/workshop.model';
import { GetInstitutionHierarchyParentsById } from 'shared/store/meta-data.actions';
import { of } from 'rxjs';
import { WorkshopInfoComponent } from './workshop-info.component';

describe('WorkshopInfoComponent', () => {
  let component: WorkshopInfoComponent;
  let fixture: ComponentFixture<WorkshopInfoComponent>;
  let store: Store;

  beforeEach(() => {
    const storeMock = {
      dispatch: jest.fn(),
      select: jest.fn().mockImplementation(() => of())
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [WorkshopInfoComponent],
      providers: [{ provide: Store, useValue: storeMock }, provideRouter([])]
    });
    fixture = TestBed.createComponent(WorkshopInfoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetInstitutionHierarchyParentsById when workshop input changes', () => {
    const institutionHierarchyId = '123';
    const workshop = { institutionHierarchyId: institutionHierarchyId } as Workshop;
    component.setWorkshop = workshop;

    expect(store.dispatch).toHaveBeenCalledWith(new GetInstitutionHierarchyParentsById(institutionHierarchyId));
  });

  it('should emit closeInfo event on onCloseInfo call', () => {
    jest.spyOn(component.closeInfo, 'emit');
    component.onCloseInfo();
    expect(component.closeInfo.emit).toHaveBeenCalled();
  });
});
