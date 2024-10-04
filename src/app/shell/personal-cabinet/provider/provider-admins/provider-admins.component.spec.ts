import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { Constants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role, Subrole } from 'shared/enum/role';
import { ProviderAdminParameters } from 'shared/models/provider-admin.model';
import { Provider } from 'shared/models/provider.model';
import { ProviderAdminsBlockData, ProviderAdminsTableData } from 'shared/models/users-table';
import { ProviderAdminsComponent } from './provider-admins.component';

describe('ProviderAdminsComponent', () => {
  let component: ProviderAdminsComponent;
  let fixture: ComponentFixture<ProviderAdminsComponent>;
  let matDialog: MatDialog;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      declarations: [ProviderAdminsComponent, MockUsersListComponent, NoResultCardComponent, ConfirmationModalWindowComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAdminsComponent);
    component = fixture.componentInstance;
    matDialog = TestBed.inject(MatDialog);
    store = TestBed.inject(Store);
    fixture.detectChanges();
    component.role = Role.provider;
    component.subrole = Subrole.None;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isMobileView on resize', () => {
    jest.spyOn(component, 'onResize');

    window.innerWidth = 300;
    window.dispatchEvent(new Event('resize'));

    expect(component.onResize).toHaveBeenCalled();
    expect(component.isSmallMobileView).toBeTruthy();
  });
  it('should not  set isMobileView on resize', () => {
    jest.spyOn(component, 'onResize');

    window.innerWidth = 700;
    window.dispatchEvent(new Event('resize'));

    expect(component.onResize).toHaveBeenCalled();
    expect(component.isSmallMobileView).toBeFalsy();
  });

  describe('onBlockUnblock method', () => {
    let expectingMatDialogData: object;
    let matDialogSpy: jest.SpyInstance;
    let dispatchSpy: jest.SpyInstance;
    let mockBlockingData: ProviderAdminsBlockData;
    let mockFilterParams: ProviderAdminParameters;

    beforeEach(() => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      component.provider = { id: 'provider Id' } as Provider;
      mockBlockingData = {
        user: {
          isDeputy: false,
          pib: 'Testing pib',
          id: 'provider admin Id'
        },
        isBlocking: false
      } as ProviderAdminsBlockData;
      mockFilterParams = {
        assistantsOnly: false,
        deputyOnly: false,
        from: 0,
        searchString: '',
        size: 12
      };
    });

    describe('when admin is Deputy', () => {
      beforeEach(() => {
        mockBlockingData.user.isDeputy = true;
      });

      it('should open matDialog with the correct parameters on Blocking', () => {
        mockBlockingData.isBlocking = true;
        expectingMatDialogData = {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.blockProviderAdminDeputy,
            property: mockBlockingData.user.pib
          }
        };
        matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: () => of(true)
        } as MatDialogRef<ConfirmationModalWindowComponent>);

        component.onBlockUnblock(mockBlockingData);

        expect(matDialogSpy).toHaveBeenCalledTimes(1);
        expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectingMatDialogData);
      });

      it('should dispatch BlockProviderAdminById action with the correct parameters on afterClosed on Blocking', () => {
        mockBlockingData.isBlocking = true;
        const expectingBlockingData = {
          payload: {
            userId: mockBlockingData.user.id,
            providerId: component.provider.id,
            isBlocked: mockBlockingData.isBlocking
          },
          filterParams: mockFilterParams
        };
        matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: () => of(expectingBlockingData)
        } as MatDialogRef<ConfirmationModalWindowComponent>);

        component.onBlockUnblock(mockBlockingData);

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(expectingBlockingData);
      });

      it('should open matDialog with the correct parameters on Unlocking', () => {
        expectingMatDialogData = {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.unBlockProviderAdminDeputy,
            property: mockBlockingData.user.pib
          }
        };
        matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: () => of(true)
        } as MatDialogRef<ConfirmationModalWindowComponent>);

        component.onBlockUnblock(mockBlockingData);

        expect(matDialogSpy).toHaveBeenCalledTimes(1);
        expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectingMatDialogData);
      });

      it('should dispatch BlockProviderAdminById action with the correct parameters on afterClosed on Unblocking', () => {
        const expectingUnblockingData = {
          payload: {
            userId: mockBlockingData.user.id,
            providerId: component.provider.id,
            isBlocked: mockBlockingData.isBlocking
          },
          filterParams: mockFilterParams
        };
        matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: () => of(expectingUnblockingData)
        } as MatDialogRef<ConfirmationModalWindowComponent>);

        component.onBlockUnblock(mockBlockingData);

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(expectingUnblockingData);
      });
    });

    describe('when admin is NOT Deputy', () => {
      it('should open matDialog with the correct parameters on Blocking', () => {
        mockBlockingData.isBlocking = true;
        expectingMatDialogData = {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.blockProviderAdmin,
            property: mockBlockingData.user.pib
          }
        };
        matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: () => of(true)
        } as MatDialogRef<ConfirmationModalWindowComponent>);

        component.onBlockUnblock(mockBlockingData);

        expect(matDialogSpy).toHaveBeenCalledTimes(1);
        expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectingMatDialogData);
      });

      it('should dispatch BlockProviderAdminById action with the correct parameters on afterClosed on Blocking', () => {
        mockBlockingData.isBlocking = true;
        const expectingBlockingData = {
          payload: {
            userId: mockBlockingData.user.id,
            providerId: component.provider.id,
            isBlocked: mockBlockingData.isBlocking
          },
          filterParams: mockFilterParams
        };
        matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: () => of(expectingBlockingData)
        } as MatDialogRef<ConfirmationModalWindowComponent>);

        component.onBlockUnblock(mockBlockingData);

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(expectingBlockingData);
      });

      it('should open matDialog with the correct parameters on Unlocking', () => {
        expectingMatDialogData = {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.unBlockProviderAdmin,
            property: mockBlockingData.user.pib
          }
        };
        matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: () => of(true)
        } as MatDialogRef<ConfirmationModalWindowComponent>);

        component.onBlockUnblock(mockBlockingData);

        expect(matDialogSpy).toHaveBeenCalledTimes(1);
        expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectingMatDialogData);
      });

      it('should dispatch BlockProviderAdminById action with the correct parameters on afterClosed on Unblocking', () => {
        const expectingUnblockingData = {
          payload: {
            userId: mockBlockingData.user.id,
            providerId: component.provider.id,
            isBlocked: mockBlockingData.isBlocking
          },
          filterParams: mockFilterParams
        };
        matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: () => of(expectingUnblockingData)
        } as MatDialogRef<ConfirmationModalWindowComponent>);

        component.onBlockUnblock(mockBlockingData);

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(expectingUnblockingData);
      });
    });
  });
});

@Component({
  selector: 'app-users-list',
  template: ''
})
class MockUsersListComponent {
  @Input() providerAdmins: ProviderAdminsTableData[];
  @Input() users: ProviderAdminsTableData[];
  @Input() userType: string;
  @Input() isEdit: boolean;
}
