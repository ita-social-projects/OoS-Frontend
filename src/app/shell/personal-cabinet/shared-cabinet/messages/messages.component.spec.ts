import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ReasonModalWindowComponent } from 'shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { BlockedParent } from 'shared/models/block.model';
import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let matDialog: MatDialog;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessagesComponent, MockNoResultCardComponent],
      imports: [MatDialogModule, NgxsModule.forRoot([]), TranslateModule.forRoot(), MatIconModule, FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    component.filterFormControl = new FormControl('');
    matDialog = TestBed.inject(MatDialog);
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onBlock method', () => {
    let matDialogSpy: jest.SpyInstance;
    let mockBlockedParent: BlockedParent;
    let expectedMatDialogData: Object;
    let dispatchSpy: jest.SpyInstance;

    beforeEach(() => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      expectedMatDialogData = {};
      mockBlockedParent = {
        parentId: 'parentId',
        providerId: 'providerId',
        reason: 'the reason of blocking'
      };
    });

    it('should open matDialog with correct parameters on onBlock method', () => {
      expectedMatDialogData = {
        data: { type: ModalConfirmationType.blockParent }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ReasonModalWindowComponent>);

      component.onBlock(mockBlockedParent.parentId);

      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(matDialogSpy).toHaveBeenCalledWith(ReasonModalWindowComponent, expectedMatDialogData);
    });

    it('should dispatch BlockParent action with the correct parameters on afterClosed', () => {
      component.providerId = mockBlockedParent.providerId;
      const expectedBlockParentDispatchData = {
        parameters: undefined,
        payload: new BlockedParent(mockBlockedParent.parentId, mockBlockedParent.providerId, mockBlockedParent.reason)
      };
      expectedBlockParentDispatchData.payload.userIdBlock = mockBlockedParent.providerId;
      const expectedChatRoomsDispatchData = {
        parameters: {
          role: null,
          workshopIds: null,
          searchText: null,
          size: PaginationConstants.CHATROOMS_PER_PAGE
        }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(expectedBlockParentDispatchData.payload.reason)
      } as MatDialogRef<ReasonModalWindowComponent>);

      component.onBlock(mockBlockedParent.parentId);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, expectedBlockParentDispatchData);
      expect(dispatchSpy).toHaveBeenLastCalledWith(expectedChatRoomsDispatchData);
    });
  });

  describe('onUnBlock method', () => {
    let matDialogSpy: jest.SpyInstance;
    let mockBlockedParent: BlockedParent;
    let expectedMatDialogData: Object;
    let dispatchSpy: jest.SpyInstance;

    beforeEach(() => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      expectedMatDialogData = {};
      mockBlockedParent = {
        parentId: 'parentId',
        providerId: 'providerId'
      };
    });

    it('should open matDialog with correct parameters on onUnBlock method', () => {
      expectedMatDialogData = {
        width: Constants.MODAL_SMALL,
        data: { type: ModalConfirmationType.unBlockParent }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ConfirmationModalWindowComponent>);

      component.onUnBlock(mockBlockedParent.parentId);

      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectedMatDialogData);
    });

    it('should dispatch UnBlockParent action with the correct parameters on afterClosed', () => {
      component.providerId = mockBlockedParent.providerId;
      const expectedUnblockParentDispatchData = {
        parameters: undefined,
        payload: new BlockedParent(mockBlockedParent.parentId, mockBlockedParent.providerId)
      };
      expectedUnblockParentDispatchData.payload.userIdUnblock = mockBlockedParent.providerId;
      const expectedChatRoomsDispatchData = {
        parameters: {
          role: null,
          workshopIds: null,
          searchText: null,
          size: PaginationConstants.CHATROOMS_PER_PAGE
        }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ConfirmationModalWindowComponent>);

      component.onUnBlock(mockBlockedParent.parentId);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, expectedUnblockParentDispatchData);
      expect(dispatchSpy).toHaveBeenLastCalledWith(expectedChatRoomsDispatchData);
    });
  });
});

@Component({
  selector: 'app-no-result-card',
  template: ''
})
class MockNoResultCardComponent {
  @Input() public title: string;
}
