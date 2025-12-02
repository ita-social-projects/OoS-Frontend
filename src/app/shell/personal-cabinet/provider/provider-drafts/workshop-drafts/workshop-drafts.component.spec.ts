import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { WorkshopDraftCard } from 'shared/models/workshop.model';
import { ApplicationChildFilterPipe } from 'shared/pipes/application-child-filter.pipe';
import { ApplicationFilterPipe } from 'shared/pipes/application-filter.pipe';
import { SearchResponse } from 'shared/models/search.model';
import { ProviderState } from 'shared/store/provider.state';
import { Provider } from 'shared/models/provider.model';
import { Role } from 'shared/enum/role';
import { DeleteWorkshopDraftById, GetProviderViewWorkshopDrafts, OnDraftSendForModerationSuccess } from 'shared/store/provider.actions';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { RegistrationState } from 'shared/store/registration.state';
import { PaginationConstants } from 'shared/constants/constants';
import { WorkshopDraftStatus } from 'shared/enum/workshop';
import { WorkshopDraftsComponent } from './workshop-drafts.component';

describe('WorkshopDraftsComponent', () => {
  let component: WorkshopDraftsComponent;
  let fixture: ComponentFixture<WorkshopDraftsComponent>;
  let actions$: Actions;
  let matDialog: MatDialog;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([]), MatDialogModule, MatTabsModule, TranslateModule.forRoot()],
      declarations: [WorkshopDraftsComponent, ApplicationFilterPipe, ApplicationChildFilterPipe, NoResultCardComponent],
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
      entities: [{} as WorkshopDraftCard, {} as WorkshopDraftCard]
    } as SearchResponse<WorkshopDraftCard[]>;

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
    matDialog = TestBed.inject(MatDialog);

    jest.spyOn(store, 'select').mockImplementation((selector) => {
      // @ts-ignore
      if (selector === ProviderState.providerWorkshopDrafts) {
        return of(initialState);
      }
      // @ts-ignore
      if (selector === RegistrationState.role) {
        return of(Role.provider);
      }
      // @ts-ignore
      if (selector === ProviderState.getTimeToLiveUnfinishedWorkshop) {
        return of('');
      }
    });

    fixture = TestBed.createComponent(WorkshopDraftsComponent);
    component = fixture.componentInstance;
    component.provider = { id: '123' } as Provider;
    component.role = Role.provider;
    component.ngOnInit(); // to set role
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set drafts', fakeAsync(() => {
    expect((component as any).workshopDrafts).toBeTruthy();
  }));

  it('should get drafts once OnDraftSendForModerationSuccess', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenCalledWith(new GetProviderViewWorkshopDrafts((component as any).workshopCardParameters));
  });

  it('trackBy fn', () => {
    const mockWorkshop = { workshopDraftId: '123', draftStatus: WorkshopDraftStatus.Draft } as WorkshopDraftCard;

    expect((component as any).trackByDraft(0, mockWorkshop)).toContain('123_Draft');
  });

  describe('MatDialog', () => {
    const mockWorkshop = { workshopDraftId: '123', title: 'test' } as WorkshopDraftCard;

    it('should open dialog', () => {
      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(true))
      };

      jest.spyOn(matDialog, 'open').mockReturnValue(dialogRef as any);

      (component as any).onDelete(mockWorkshop);

      expect(matDialog.open).toHaveBeenCalledWith(
        ConfirmationModalWindowComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            type: ModalConfirmationType.deleteDraft,
            property: mockWorkshop.title
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

      (component as any).onDelete(mockWorkshop);

      expect(dispatchSpy).toHaveBeenCalledWith(
        new DeleteWorkshopDraftById(mockWorkshop.workshopDraftId, (component as any).workshopCardParameters)
      );
    });

    it('should not dispatch DeleteWorkshopDraftById', () => {
      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(false))
      };

      jest.spyOn(matDialog, 'open').mockReturnValue(dialogRef as any);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      (component as any).onDelete(mockWorkshop);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('should update currentPage', () => {
      const mockPage = { element: 1, isActive: true };
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      (component as any).onPageChange(mockPage);

      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should update item per page', () => {
      const mockSize = 8;
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      (component as any).onItemsPerPageChange(8);

      expect((component as any).workshopCardParameters.size).toEqual(mockSize);
      expect((component as any).currentPage).toEqual(PaginationConstants.firstPage);
      expect(dispatchSpy).toHaveBeenCalledWith(new GetProviderViewWorkshopDrafts((component as any).workshopCardParameters));
    });
  });
});
