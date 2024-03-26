import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { AdminsBlockData, InvitationData } from 'shared/models/users-table';
import { AdminRoles } from 'shared/enum/admins';
import { ReinviteAdminById } from 'shared/store/admin.actions';
import { Constants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { AdminsComponent } from './admins.component';

describe('AdminsComponent', () => {
  let component: AdminsComponent;
  let fixture: ComponentFixture<AdminsComponent>;
  let store: Store;
  let matDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        NgxsModule.forRoot([]),
        MatMenuModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatDialogModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [AdminsComponent, NoResultCardComponent, MockListAdminsPaginatorComponent, MockUsersListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    matDialog = TestBed.inject(MatDialog);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onBlockUnblock method', () => {
    let dispatchSpy: jest.SpyInstance;
    let matDialogSpy: jest.SpyInstance;
    let mockAdminData: AdminsBlockData;
    let expectingMatDialogData: object;

    beforeEach(() => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      mockAdminData = {
        user: { id: 'ministry admin Id' },
        isBlocking: false
      } as AdminsBlockData;
    });

    it('should open matDialog with the correct parameters on Blocking', () => {
      mockAdminData.isBlocking = true;
      expectingMatDialogData = {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.blockAdmin,
          property: mockAdminData.user.pib
        }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ConfirmationModalWindowComponent>);

      component.onBlockUnblock(mockAdminData);

      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectingMatDialogData);
    });

    it('should dispatch BlockAdminById action with the correct parameters on afterClosed on Blocking', () => {
      mockAdminData.isBlocking = true;
      const expectingBlockingData = {
        payload: {
          adminId: mockAdminData.user.id,
          isBlocked: mockAdminData.isBlocking,
          admin: undefined
        }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(mockAdminData.user)
      } as MatDialogRef<ConfirmationModalWindowComponent>);

      component.onBlockUnblock(mockAdminData);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(expectingBlockingData);
    });

    it('should open matDialog with the correct parameters on Unblocking', () => {
      expectingMatDialogData = {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.unBlockAdmin,
          property: mockAdminData.user.pib
        }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ConfirmationModalWindowComponent>);

      component.onBlockUnblock(mockAdminData);

      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectingMatDialogData);
    });

    it('should dispatch BlockAdminById action with the correct parameters on afterClosed on Unblocking', () => {
      const expectingUnblockingData = {
        payload: {
          adminId: mockAdminData.user.id,
          isBlocked: mockAdminData.isBlocking,
          admin: undefined
        }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(mockAdminData.user)
      } as MatDialogRef<ConfirmationModalWindowComponent>);

      component.onBlockUnblock(mockAdminData);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(expectingUnblockingData);
    });
  });

  describe('onSendInvitation method', () => {
    let dispatchSpy: jest.SpyInstance;

    beforeEach(() => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
    });

    it('should dispatch ReinviteAdminById action with correct parameters when onSendInvitation method executes', () => {
      const mockInvitationData = {
        user: { id: 'mockUserId' },
        adminType: AdminRoles.ministryAdmin
      } as InvitationData;

      component.onSendInvitation(mockInvitationData);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new ReinviteAdminById(mockInvitationData.user.id, mockInvitationData.adminType));
    });
  });
});

@Component({
  selector: 'app-users-list',
  template: ''
})
class MockUsersListComponent {
  @Input() users: object[];
  @Input() isEdit: boolean;
}

@Component({
  selector: 'app-paginator',
  template: ''
})
class MockListAdminsPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}
