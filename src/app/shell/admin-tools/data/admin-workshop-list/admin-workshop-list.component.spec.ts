import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'shared/shared.module';
import { provideRouter } from '@angular/router';
import { WorkshopDraft } from 'shared/models/workshop.model';
import { GetFilteredWorkshopDrafts } from 'shared/store/admin.actions';
import { of } from 'rxjs';
import { AdminWorkshopListComponent } from './admin-workshop-list.component';

describe('AdminWorkshopListComponent', () => {
  let component: AdminWorkshopListComponent;
  let fixture: ComponentFixture<AdminWorkshopListComponent>;
  let store: jest.Mocked<Store>;
  beforeEach(() => {
    const storeMock: Partial<jest.Mocked<Store>> = {
      dispatch: jest.fn().mockReturnValue(of({})),
      select: jest.fn().mockReturnValue(of({}))
    };
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), SharedModule, BrowserAnimationsModule],
      declarations: [AdminWorkshopListComponent],
      providers: [{ provide: Store, useValue: storeMock }, provideRouter([])]
    });

    fixture = TestBed.createComponent(AdminWorkshopListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetFilteredWorkshopDrafts on onItemsPerPageChange', () => {
    const itemsPerPage = 10;

    component.onItemsPerPageChange(itemsPerPage);

    expect(component.workshopParameters.size).toBe(itemsPerPage);
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetFilteredWorkshopDrafts));
  });

  it('should set workshop info on onViewWorkshopInfo', () => {
    const workshop: WorkshopDraft = {
      workshopDraftId: '123',
      workshopDetails: { title: 'Test Event' }
    } as any;

    component.onViewWorkshopInfo(workshop);

    expect(component.selectedWorkshopDraftId).toBe('123');
    expect(component.workshop).toEqual({ title: 'Test Event' });
    expect(component.isInfoDisplayed).toBe(true);
  });

  it('should reset workshop info on closeInfo', () => {
    component.selectedWorkshopDraftId = '123';
    component.workshop = { title: 'Test Event' } as any;
    component.isInfoDisplayed = true;

    component.closeInfo();

    expect(component.isInfoDisplayed).toBe(false);
    expect(component.selectedWorkshopDraftId).toBeNull();
  });

  it('should reset info on onViewWorkshopInfo for the same workshop', () => {
    jest.spyOn(component, 'closeInfo');
    component.selectedWorkshopDraftId = '123';
    component.isInfoDisplayed = true;

    const workshop: WorkshopDraft = {
      workshopDraftId: '123',
      workshopDetails: { title: 'Test Event' }
    } as any;

    component.onViewWorkshopInfo(workshop);

    expect(component.isInfoDisplayed).toBe(false);
    expect(component.selectedWorkshopDraftId).toBeNull();
    expect(component.closeInfo).toHaveBeenCalled();
  });
});
