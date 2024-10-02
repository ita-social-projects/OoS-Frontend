import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { AdminRoles } from 'shared/enum/admins';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { AdminsBlockData, AdminsTableData, InvitationData } from 'shared/models/users-table';
import { DeleteAdminById, GetAllAdmins, ReinviteAdminById } from 'shared/store/admin.actions';
import { AdminStateModel } from 'shared/store/admin.state';
import { RegistrationStateModel } from 'shared/store/registration.state';
import { AdminsComponent } from './admins.component';

describe('AdminsComponent', () => {
  let component: AdminsComponent;
  let fixture: ComponentFixture<AdminsComponent>;
  let store: Store;
  let router: Router;
  let matDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        NgxsModule.forRoot([MockRegistrationState, MockAdminState]),
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
    router = TestBed.inject(Router);
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
        adminType: AdminRoles.regionAdmin,
        payload: {
          adminId: mockAdminData.user.id,
          isBlocked: mockAdminData.isBlocking
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
        adminType: AdminRoles.regionAdmin,
        payload: {
          adminId: mockAdminData.user.id,
          isBlocked: mockAdminData.isBlocking
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

  describe('getAdmins method', () => {
    beforeEach(() => jest.spyOn(store, 'dispatch'));

    it('should dispatch GetAllAdmins with new parameters when filterFormControl value changes', fakeAsync(() => {
      const expectedFilterSearchValue = 'region';
      component.currentPage.element = 3;

      component.filterFormControl.setValue(expectedFilterSearchValue);
      tick(2000);

      expect(component.adminParams.searchString).toEqual(expectedFilterSearchValue);
      expect(component.currentPage).toEqual(PaginationConstants.firstPage);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(new GetAllAdmins(component.adminType, component.adminParams));
    }));

    it('should dispatch GetAllAdmins with new parameters when onTabChange called', () => {
      component.currentPage.element = 5;
      component.filterFormControl.setValue('ministry', { emitEvent: false });
      component.adminParams = { searchString: 'ministry', from: 3, tabTitle: '1' };

      component.onTabChange({ index: 2 } as MatTabChangeEvent);

      expect(component.currentPage).toEqual(PaginationConstants.firstPage);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(new GetAllAdmins(component.adminType, component.adminParams));
    });

    it('should dispatch GetAllAdmins with new parameters when onPageChange called', () => {
      const expectedPage: PaginationElement = { element: 3, isActive: true };
      component.currentPage.element = 1;

      component.onPageChange(expectedPage);

      expect(component.currentPage).toEqual(expectedPage);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(new GetAllAdmins(component.adminType, component.adminParams));
    });

    it('should dispatch GetAllAdmins with new parameters when onItemsPerPage called', () => {
      const expectedItemsPerPage = 8;
      component.adminParams.size = 30;
      jest.spyOn(component, 'onPageChange');

      component.onItemsPerPageChange(expectedItemsPerPage);

      expect(component.adminParams.size).toEqual(expectedItemsPerPage);
      expect(component.currentPage).toEqual(PaginationConstants.firstPage);
      expect(component.onPageChange).toHaveBeenCalledWith(PaginationConstants.firstPage);
      expect(store.dispatch).toHaveBeenCalledWith(new GetAllAdmins(component.adminType, component.adminParams));
    });
  });

  it('should navigate to update-admin URL when onUpdate called', () => {
    const expectedAdmin = { id: 'adminId' } as AdminsTableData;
    jest.spyOn(router, 'navigate');

    component.onUpdate(expectedAdmin);

    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith([`update-admin/${component.adminParams.tabTitle}/${expectedAdmin.id}`]);
  });

  it('should dispatch DeleteAdminById and open matDialog when onDelete called and dialog is closed', () => {
    const expectedAdmin = { id: 'adminId', pib: 'adminPib' } as AdminsTableData;
    const expectedMatDialogData = {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteAdmin,
        property: expectedAdmin.pib
      }
    };
    jest.spyOn(store, 'dispatch');
    jest.spyOn(matDialog, 'open').mockReturnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<ConfirmationModalWindowComponent>);

    component.onDelete(expectedAdmin);

    expect(matDialog.open).toHaveBeenCalledTimes(1);
    expect(matDialog.open).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectedMatDialogData);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteAdminById(expectedAdmin.id, component.adminType));
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

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    role: Role.ministryAdmin
  } as RegistrationStateModel
})
@Injectable()
export class MockRegistrationState {}

@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    isLoading: false,
    admins: { entities: [], totalAmount: 0 }
  } as AdminStateModel
})
@Injectable()
class MockAdminState {}
