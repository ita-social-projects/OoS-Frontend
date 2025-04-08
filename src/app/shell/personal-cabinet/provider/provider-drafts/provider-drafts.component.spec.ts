import { Component, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { Workshop, WorkshopDraftCard } from 'shared/models/workshop.model';
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
import { ProviderDraftsComponent } from './provider-drafts.component';

describe('ProviderWorkshopsComponent', () => {
  let component: ProviderDraftsComponent;
  let fixture: ComponentFixture<ProviderDraftsComponent>;
  let actions$: Actions;
  let matDialog: MatDialog;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([]), MatDialogModule, MatTabsModule, TranslateModule.forRoot()],
      declarations: [
        ProviderDraftsComponent,
        MockWorkshopCardComponent,
        ApplicationFilterPipe,
        ApplicationChildFilterPipe,
        NoResultCardComponent
      ],
      providers: [
        [
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
      if (selector === ProviderState.providerDrafts) {
        return of(initialState);
      }
      // @ts-ignore
      if (selector === RegistrationState.role) {
        return of(Role.provider);
      }
    });

    fixture = TestBed.createComponent(ProviderDraftsComponent);
    component = fixture.componentInstance;
    component.provider = { id: '123' } as Provider;
    component.ngOnInit(); // to set role
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set drafts', fakeAsync(() => {
    component.initProviderData();

    expect(component.workshopDrafts).toBeTruthy();
  }));

  it('should get drafts if OnDraftSendForModerationSuccess', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.initProviderData();

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(new GetProviderViewWorkshopDrafts(component.workshopCardParameters));
  });

  it('trackBy fn', () => {
    const mockWorkshop = { workshopDraftId: '123' } as WorkshopDraftCard;

    expect(component.trackByDraft(0, mockWorkshop)).toBe('123');
  });

  describe('MatDialog', () => {
    const mockWorkshop = { workshopDraftId: '123', title: 'test' } as WorkshopDraftCard;

    it('should open dialog', () => {
      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(true))
      };

      jest.spyOn(matDialog, 'open').mockReturnValue(dialogRef as any);

      component.onDelete(mockWorkshop);

      expect(matDialog.open).toHaveBeenCalledWith(
        ConfirmationModalWindowComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            type: ModalConfirmationType.delete,
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

      component.onDelete(mockWorkshop);

      expect(dispatchSpy).toHaveBeenCalledWith(new DeleteWorkshopDraftById(mockWorkshop, component.workshopCardParameters));
    });

    it('should not dispatch DeleteWorkshopDraftById', () => {
      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(false))
      };

      jest.spyOn(matDialog, 'open').mockReturnValue(dialogRef as any);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onDelete(mockWorkshop);

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

      component.onPageChange = jest.fn();
      component.onItemsPerPageChange(8);

      expect(component.workshopCardParameters.size).toEqual(mockSize);
      expect(component.onPageChange).toHaveBeenCalled();
    });
  });
});

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isCabinetView: boolean;
}
