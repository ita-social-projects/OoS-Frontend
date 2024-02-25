import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { NotificationDescriptions } from 'shared/enum/enumUA/notifications';
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

    describe('Short notification description type', () => {
      const descriptionType = NotificationDescriptionType.Short;

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
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Workshop.Open);
        });

        it('should transform Workshop notification with Update action and Closed status', () => {
          jest.spyOn(translateService, 'instant');

          notification.action = NotificationAction.Update;
          notification.data.Status = 'Closed';

          const result = pipe.transform(notification, descriptionType);

          expect(result).toBeDefined();
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Workshop.Closed);
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
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Provider.Create);
        });

        it('should transform Provider notification with Update action and Approved status', () => {
          jest.spyOn(translateService, 'instant');

          notification.action = NotificationAction.Update;
          notification.data.Status = 'Approved';

          const result = pipe.transform(notification, descriptionType);

          expect(result).toBeDefined();
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Provider.Approved);
        });

        it('should transform Provider notification with Update action and Editing status', () => {
          jest.spyOn(translateService, 'instant');

          notification.action = NotificationAction.Update;
          notification.data.Status = 'Editing';

          const result = pipe.transform(notification, descriptionType);

          expect(result).toBeDefined();
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Provider.Editing);
        });

        it('should transform Provider notification with Recheck action', () => {
          jest.spyOn(translateService, 'instant');

          notification.action = NotificationAction.Update;
          notification.data.Status = 'Recheck';

          const result = pipe.transform(notification, descriptionType);

          expect(result).toBeDefined();
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Provider.Recheck);
        });

        it('should transform Provider notification with Block action', () => {
          jest.spyOn(translateService, 'instant');

          notification.action = NotificationAction.Block;

          const result = pipe.transform(notification, descriptionType);

          expect(result).toBeDefined();
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Provider.Block);
        });

        it('should transform Provider notification with Unblock action', () => {
          jest.spyOn(translateService, 'instant');

          notification.action = NotificationAction.Unblock;

          const result = pipe.transform(notification, descriptionType);

          expect(result).toBeDefined();
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Provider.Unblock);
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
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Parent.ProviderBlock);
        });

        it('should transform Parent notification with ProviderUnblock action', () => {
          jest.spyOn(translateService, 'instant');

          notification.action = NotificationAction.ProviderUnblock;

          const result = pipe.transform(notification, descriptionType);

          expect(result).toBeDefined();
          expect(translateService.instant).toHaveBeenCalledWith(NotificationDescriptions.Short.Parent.ProviderUnblock);
        });
      });
    });

    describe('Full notification description type', () => {
      const descriptionType = NotificationDescriptionType.Full;

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
});
