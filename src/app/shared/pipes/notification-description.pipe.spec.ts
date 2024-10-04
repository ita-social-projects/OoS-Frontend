import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { Constants } from 'shared/constants/constants';
import { NotificationDescriptions } from 'shared/enum/enumUA/notifications';
import { ApplicationTitles } from 'shared/enum/enumUA/statuses';
import { NotificationAction, NotificationDescriptionType, NotificationType } from 'shared/enum/notifications';
import { Notification } from 'shared/models/notification.model';
import { NotificationDescriptionPipe } from './notification-description.pipe';

describe('NotificationDescriptionPipe', () => {
  let pipe: NotificationDescriptionPipe;
  let translateService: TranslateService;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgxsModule.forRoot([])]
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    store = TestBed.inject(Store);
    pipe = new NotificationDescriptionPipe(translateService, store);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    const notification: Notification = {
      type: undefined,
      action: undefined,
      data: {},
      userId: undefined,
      createdDateTime: undefined
    };
    const descriptionType = NotificationDescriptionType.Full;

    it('should transform System notification with Unknown action to no message info', () => {
      jest.spyOn(translateService, 'instant');

      notification.type = NotificationType.System;
      notification.action = NotificationAction.Unknown;

      const result = pipe.transform(notification, descriptionType);

      expect(result).toBeDefined();
      expect(translateService.instant).toHaveBeenCalledWith(Constants.NO_INFORMATION);
    });

    it('should transform Application notification with Update action and Approved status', () => {
      jest.spyOn(translateService, 'instant');

      notification.type = NotificationType.Application;
      notification.action = NotificationAction.Update;
      notification.data.Status = 'Approved';

      const result = pipe.transform(notification, descriptionType);

      expect(result).toBeDefined();
      expect(translateService.instant).toHaveBeenCalledWith(ApplicationTitles.Approved);
    });

    describe('Workshop notification type', () => {
      beforeEach(() => {
        notification.type = NotificationType.Workshop;
      });

      it('should transform Workshop notification with Update action and Open status', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.Update;
        notification.data.Status = 'Open';

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Workshop.Open);
      });

      it('should transform Workshop notification with Update action and Closed status', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.Update;
        notification.data.Status = 'Closed';

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Workshop.Closed);
      });
    });

    describe('Provider notification type', () => {
      beforeEach(() => {
        notification.type = NotificationType.Provider;
      });

      it('should transform Provider notification with Create action', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.Create;

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Provider.Create);
      });

      it('should transform Provider notification with Update action and Approved status', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.Update;
        notification.data.Status = 'Approved';

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Provider.Approved);
      });

      it('should transform Provider notification with Update action and Editing status', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.Update;
        notification.data.Status = 'Editing';

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Provider.Editing);
      });

      it('should transform Provider notification with Recheck action', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.Update;
        notification.data.Status = 'Recheck';

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Provider.Recheck);
      });

      it('should transform Provider notification with Block action', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.Block;

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Provider.Block);
      });

      it('should transform Provider notification with Unblock action', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.Unblock;

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Provider.Unblock);
      });

      it('should transform Provider notification with LicenseApproval action and Approved status', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.LicenseApproval;
        notification.data.Status = 'Approved';

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.LicenseStatus.Approved);
      });
    });

    describe('Parent notification type', () => {
      beforeEach(() => {
        notification.type = NotificationType.Parent;
      });

      it('should transform Parent notification with ProviderBlock action', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.ProviderBlock;

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Parent.ProviderBlock);
      });

      it('should transform Parent notification with ProviderUnblock action', () => {
        jest.spyOn(translateService, 'instant');

        notification.action = NotificationAction.ProviderUnblock;

        const result = pipe.transform(notification, descriptionType);

        expect(result).toBeDefined();
        expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Full.Parent.ProviderUnblock);
      });
    });
  });
});
