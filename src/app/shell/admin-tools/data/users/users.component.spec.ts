import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ReasonModalWindowComponent } from 'shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { UsersBlockData } from 'shared/models/users-table';
import { GetChildrenForAdmin } from 'shared/store/admin.actions';
import { AdminStateModel } from 'shared/store/admin.state';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let matDialog: MatDialog;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([MockAdminState]),
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatIconModule,
        TranslateModule.forRoot(),
        MatDialogModule
      ],
      declarations: [UsersComponent, MockUsersListComponent, NoResultCardComponent, MockListAdminChildrenPaginatorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    matDialog = TestBed.inject(MatDialog);
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onBlockUnblock method', () => {
    let matDialogSpy: jest.SpyInstance;
    let mockUser: UsersBlockData;
    let expectedMatDialogData: Object;
    let dispatchSpy: jest.SpyInstance;

    beforeEach(() => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      mockUser = {
        user: {
          parentId: 'parentId',
          isBlocked: false,
          parentFullName: 'Parent full name',
          id: '',
          pib: '',
          email: '',
          phoneNumber: '',
          status: '',
          role: ''
        },
        isBlocking: false
      };
      expectedMatDialogData = {};
    });

    it('should open matDialog with correct parameters on Unblocking', () => {
      mockUser.isBlocking = false;
      expectedMatDialogData = {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.unBlockParent,
          property: mockUser.user.parentFullName
        }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ConfirmationModalWindowComponent>);

      component.onBlockUnblock(mockUser);

      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectedMatDialogData);
    });

    it('should dispatch OnUnblockParent action with the correct parameters on afterClosed', () => {
      mockUser.isBlocking = false;
      const expectedUnblockParentDispatchData = {
        payload: {
          parentId: 'parentId',
          isBlocked: false
        }
      };
      const expectedChildrenDispatchData = {
        parameters: {
          from: 0,
          isParent: null,
          searchString: '',
          size: 12
        }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ConfirmationModalWindowComponent>);

      component.onBlockUnblock(mockUser);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, expectedUnblockParentDispatchData);
      expect(dispatchSpy).toHaveBeenLastCalledWith(expectedChildrenDispatchData);
    });

    it('should open matDialog with correct parameters on Blocking', () => {
      mockUser.isBlocking = true;
      expectedMatDialogData = {
        data: { type: ModalConfirmationType.blockParent }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ReasonModalWindowComponent>);

      component.onBlockUnblock(mockUser);

      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(matDialogSpy).toHaveBeenCalledWith(ReasonModalWindowComponent, expectedMatDialogData);
    });

    it('should dispatch OnBlockParent action with the correct parameters on afterClosed', () => {
      mockUser.isBlocking = true;
      const expectedBlockParentDispatchData = {
        payload: {
          parentId: mockUser.user.parentId,
          isBlocked: true,
          reason: 'the reason of blocking'
        }
      };
      const expectedChildrenDispatchData = {
        parameters: {
          from: 0,
          isParent: null,
          searchString: '',
          size: 12
        }
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(expectedBlockParentDispatchData.payload.reason)
      } as MatDialogRef<ReasonModalWindowComponent>);

      component.onBlockUnblock(mockUser);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, expectedBlockParentDispatchData);
      expect(dispatchSpy).toHaveBeenLastCalledWith(expectedChildrenDispatchData);
    });
  });

  describe('getChildren method', () => {
    beforeEach(() => {
      jest.spyOn(store, 'dispatch');
    });

    it('should dispatch GetChildrenForAdmin action when filterFormControl value changes', fakeAsync(() => {
      component.filterFormControl.setValue('SearchValue');
      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(new GetChildrenForAdmin(component.childrenParams));
    }));

    it('should dispatch GetChildrenForAdmin action with new parameters when onTabChange called', () => {
      component.currentPage.element = 5;

      component.onTabChange({ index: 2 } as MatTabChangeEvent);

      expect(component.currentPage).toEqual(PaginationConstants.firstPage);
      expect(store.dispatch).toHaveBeenCalledWith(new GetChildrenForAdmin(component.childrenParams));
    });

    it('should dispatch GetChildrenForAdmin action with new parameters when onPageChange called', () => {
      const expectedPage: PaginationElement = { element: 3, isActive: true };
      component.currentPage.element = 3;

      component.onPageChange(expectedPage);

      expect(component.currentPage).toEqual(expectedPage);
      expect(store.dispatch).toHaveBeenCalledWith(new GetChildrenForAdmin(component.childrenParams));
    });

    it('should dispatch GetChildrenForAdmin action with new parameters when onTableItemsPerPageChange called', () => {
      const expectedItemsPerPage = 15;
      component.childrenParams.size = 5;

      component.onTableItemsPerPageChange(expectedItemsPerPage);

      expect(component.childrenParams.size).toEqual(expectedItemsPerPage);
      expect(store.dispatch).toHaveBeenCalledWith(new GetChildrenForAdmin(component.childrenParams));
    });
  });
});

@Component({
  selector: 'app-users-list',
  template: ''
})
class MockUsersListComponent {
  @Input() users: object[];
  @Input() displayedColumns: string[];
}

@Component({
  selector: 'app-paginator',
  template: ''
})
class MockListAdminChildrenPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}

@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    isLoading: false,
    children: { entities: [], totalAmount: 0 }
  } as AdminStateModel
})
@Injectable()
class MockAdminState {}
