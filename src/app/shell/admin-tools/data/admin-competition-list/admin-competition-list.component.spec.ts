import { ElementRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SharedModule } from 'shared/shared.module';
import { GetFilteredCompetitionDrafts } from 'shared/store/admin.actions';
import { CompetitionDraft } from 'shared/models/competition.model';
import { AdminCompetitionListComponent } from './admin-competition-list.component';

describe('AdminCompetitionListComponent', () => {
  let component: AdminCompetitionListComponent;
  let fixture: ComponentFixture<AdminCompetitionListComponent>;
  let store: jest.Mocked<Store>;
  let mockElementRef: ElementRef;

  beforeEach(() => {
    const storeMock: Partial<jest.Mocked<Store>> = {
      dispatch: jest.fn().mockReturnValue(of({})),
      select: jest.fn().mockReturnValue(of({}))
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), SharedModule, BrowserAnimationsModule],
      declarations: [AdminCompetitionListComponent],
      providers: [{ provide: Store, useValue: storeMock }, provideRouter([])]
    });

    fixture = TestBed.createComponent(AdminCompetitionListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
    fixture.detectChanges();

    globalThis.ResizeObserver = class MockResizeObserver {
      observe = jest.fn();
      disconnect = jest.fn();
      constructor(public callback: () => void) {}
    } as any;

    mockElementRef = {
      nativeElement: { offsetHeight: 123 }
    } as ElementRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetFilteredCompetitionDrafts on onItemsPerPageChange', () => {
    const itemsPerPage = 10;

    component.onItemsPerPageChange(itemsPerPage);

    expect(component.competitionParameters.size).toBe(itemsPerPage);
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetFilteredCompetitionDrafts));
  });

  it('should set competition info on onViewCompetitionInfo', () => {
    const competition: CompetitionDraft = {
      competitiveEventDraftId: '123',
      competitiveEventDetails: { title: 'Test Event' }
    } as any;

    component.onViewCompetitionInfo(competition);

    expect(component.selectedCompetitionDraftId).toBe('123');
    expect(component.competition).toEqual({ title: 'Test Event' });
    expect(component.isInfoDisplayed).toBe(true);
  });

  it('should reset competition info on closeInfo', () => {
    component.selectedCompetitionDraftId = '123';
    component.competition = { title: 'Test Event' } as any;
    component.isInfoDisplayed = true;

    component.closeInfo();

    expect(component.isInfoDisplayed).toBe(false);
    expect(component.selectedCompetitionDraftId).toBeNull();
  });

  it('should reset info on onViewWorkshopInfo for the same competition', () => {
    jest.spyOn(component, 'closeInfo');
    component.selectedCompetitionDraftId = '123';
    component.isInfoDisplayed = true;

    const competition: CompetitionDraft = {
      competitiveEventDraftId: '123',
      competitiveEventDetails: { title: 'Test Event' }
    } as any;

    component.onViewCompetitionInfo(competition);

    expect(component.isInfoDisplayed).toBe(false);
    expect(component.selectedCompetitionDraftId).toBeNull();
    expect(component.closeInfo).toHaveBeenCalled();
  });

  it('should create observer and emit height', () => {
    const nextSpy = jest.spyOn(component.height$, 'next');

    component.table = mockElementRef;

    expect((component as any).resizeObserver).toBeInstanceOf(ResizeObserver);
    expect((component as any).resizeObserver?.observe).toHaveBeenCalledWith(mockElementRef.nativeElement);
    expect(nextSpy).toHaveBeenCalledWith(123);

    mockElementRef.nativeElement.offsetHeight = 200;
    (component as any).resizeObserver.callback([], (component as any).resizeObserver);
    expect(nextSpy).toHaveBeenCalledWith(200);
  });
});
