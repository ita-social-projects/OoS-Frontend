import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { AdminsComponent } from './admins.component';
import { InvitationData } from 'shared/models/users-table';
import { AdminRoles } from 'shared/enum/admins';
import { ReinviteAdminById } from 'shared/store/admin.actions';

describe('AdminsComponent', () => {
  let component: AdminsComponent;
  let fixture: ComponentFixture<AdminsComponent>;
  let store: Store;

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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
