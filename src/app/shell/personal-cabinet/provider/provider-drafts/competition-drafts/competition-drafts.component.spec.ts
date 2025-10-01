import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  DeleteCompetitionDraftById,
  GetProviderViewCompetitionDrafts,
  OnDraftSendForModerationSuccess
} from 'shared/store/provider.actions';
import { SearchResponse } from 'shared/models/search.model';
import { ProviderState } from 'shared/store/provider.state';
import { Provider } from 'shared/models/provider.model';
import { Role } from 'shared/enum/role';
import { CompetitionDraftCard } from 'shared/models/competition.model';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { PaginationConstants } from 'shared/constants/constants';
import { CompetitionDraftsComponent } from './competition-drafts.component';

describe('CompetitionDraftsComponent', () => {
  let component: CompetitionDraftsComponent;
  let fixture: ComponentFixture<CompetitionDraftsComponent>;
  let actions$: Actions;
  let matDialog: MatDialog;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([]), MatDialogModule, TranslateModule.forRoot()],
      declarations: [CompetitionDraftsComponent],
      providers: [
        {
          provide: Actions,
          useValue: {
            pipe: jest.fn().mockReturnValue(of(new OnDraftSendForModerationSuccess()))
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn()
          }
        }
      ]
    }).compileComponents();
    const initialState = {
      totalAmount: 2,
      entities: [{} as CompetitionDraftCard, {} as CompetitionDraftCard]
    } as SearchResponse<CompetitionDraftCard[]>;

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
    matDialog = TestBed.inject(MatDialog);

    jest.spyOn(store, 'select').mockImplementation((selector) => {
      // @ts-ignore
      if (selector === ProviderState.providerCompetitionDrafts) {
        return of(initialState);
      }
    });

    fixture = TestBed.createComponent(CompetitionDraftsComponent);
    component = fixture.componentInstance;
    component.provider = { id: '123' } as Provider;
    component.role = Role.provider;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set drafts', fakeAsync(() => {
    component.ngOnInit();

    expect(component.competitionDrafts).toBeTruthy();
  }));

  it('should get drafts if OnDraftSendForModerationSuccess', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(new GetProviderViewCompetitionDrafts(component.competitionCardParameters));
  });

  it('trackBy fn', () => {
    const mockCompetition = { competitiveEventDraftId: '123' } as CompetitionDraftCard;

    expect(component.trackByDraft(0, mockCompetition)).toBe('123');
  });

  describe('MatDialog', () => {
    const mockCompetition = { competitiveEventDraftId: '123', title: 'test' } as CompetitionDraftCard;

    it('should open dialog', () => {
      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(true))
      };

      jest.spyOn(matDialog, 'open').mockReturnValue(dialogRef as any);

      component.onDelete(mockCompetition);

      expect(matDialog.open).toHaveBeenCalledWith(
        ConfirmationModalWindowComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            type: ModalConfirmationType.deleteDraft,
            property: mockCompetition.title
          })
        })
      );
    });

    it('should dispatch DeleteWorkshopDraftById', () => {
      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(true))
      };

      jest.spyOn(matDialog, 'open').mockReturnValue(dialogRef as any);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onDelete(mockCompetition);

      expect(dispatchSpy).toHaveBeenCalledWith(
        new DeleteCompetitionDraftById(mockCompetition.competitiveEventDraftId, component.competitionCardParameters)
      );
    });

    it('should not dispatch DeleteWorkshopDraftById', () => {
      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(false))
      };

      jest.spyOn(matDialog, 'open').mockReturnValue(dialogRef as any);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onDelete(mockCompetition);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('should update currentPage', () => {
      const mockPage = { element: 1, isActive: true };
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onPageChange(mockPage);

      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should update item per page', () => {
      const mockSize = 8;
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onItemsPerPageChange(8);

      expect(component.competitionCardParameters.size).toEqual(mockSize);
      expect(component.currentPage).toEqual(PaginationConstants.firstPage);
      expect(dispatchSpy).toHaveBeenCalledWith(new GetProviderViewCompetitionDrafts(component.competitionCardParameters));
    });
  });
});
