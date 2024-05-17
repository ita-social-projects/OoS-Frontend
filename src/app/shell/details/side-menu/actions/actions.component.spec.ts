import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MatLegacyDialog as MatDialog
} from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { User } from 'shared/models/user.model';
import { Workshop } from 'shared/models/workshop.model';
import { Role } from 'shared/enum/role';
import { UnregisteredUserWarningModalComponent } from 'shared/components/unregistered-user-warning-modal/unregistered-user-warning-modal.component';
import { ModalConfirmationDescription } from 'shared/enum/modal-confirmation';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { ShowMessageBar } from 'shared/store/app.actions';
import { ModeConstants } from 'shared/constants/constants';
import { ActionsComponent } from './actions.component';

describe('ActionsComponent', () => {
  let component: ActionsComponent;
  let fixture: ComponentFixture<ActionsComponent>;
  let store: Store;
  let matDialog: MatDialog;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule, MatIconModule, NgxsModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ActionsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of({ role: '' } as User));
    fixture = TestBed.createComponent(ActionsComponent);
    component = fixture.componentInstance;
    matDialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    component.workshop = {} as Workshop;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onOpenDialog method', () => {
    let dispatchSpy: jest.SpyInstance;
    let matDialogSpy: jest.SpyInstance;
    let expectedMatDialogData: object;

    beforeEach(() => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
    });

    it('should open UnregisteredUserWarningModalComponent when user is unauthorized', () => {
      component.role = Role.unauthorized;
      expectedMatDialogData = {
        autoFocus: false,
        data: {
          message: ModalConfirmationDescription.unregisteredApplicationWarning
        },
        restoreFocus: false
      };
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<UnregisteredUserWarningModalComponent>);

      component.onOpenDialog(ModalConfirmationDescription.unregisteredApplicationWarning);
      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(matDialogSpy).toHaveBeenCalledWith(UnregisteredUserWarningModalComponent, expectedMatDialogData);
    });

    it('should dispatch new ShowMessageBar when parent is blocked', () => {
      component.role = Role.parent;
      const expectedMessageBar = new ShowMessageBar({
        message: SnackbarText.accessIsRestricted,
        type: 'error',
        info: SnackbarText.accessIsRestrictedFullDescription
      });

      component.onOpenDialog(ModalConfirmationDescription.unregisteredApplicationWarning);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(expectedMessageBar);
    });

    it('should navigate to create application page when user neither blocked or unauthorized', () => {
      component.workshop.id = 'workshopId';
      component.role = Role.parent;
      component.isBlocked = false;
      jest.spyOn(router, 'navigate');

      component.onOpenDialog(ModalConfirmationDescription.unregisteredApplicationWarning);

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/create-application', component.workshop.id]);
    });

    it('should navigate to send message page when user click on "Send a message" button', () => {
      component.workshop.id = 'workshopId';
      component.role = Role.parent;
      component.isBlocked = false;
      jest.spyOn(router, 'navigate');

      component.onOpenDialog(ModalConfirmationDescription.unregisteredMessageWarning);

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/personal-cabinet/messages/', component.workshop.id], {
        queryParams: {
          mode: ModeConstants.WORKSHOP
        }
      });
    });
  });
});
