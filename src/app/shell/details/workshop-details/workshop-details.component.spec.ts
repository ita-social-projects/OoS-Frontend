import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { ImageCarouselComponent } from 'shared/components/image-carousel/image-carousel.component';
import { Role } from 'shared/enum/role';
import { Provider } from 'shared/models/provider.model';
import { Teacher } from 'shared/models/teacher.model';
import { Workshop, WorkshopDraft } from 'shared/models/workshop.model';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Constants } from 'shared/constants/constants';
import { ArchiveWorkshopById, DraftSendForModeration, GetWorkshopDraftIdByWorkshopId } from 'shared/store/provider.actions';
import { ImagesService } from 'shared/services/images/images.service';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { WorkshopDetailsComponent } from './workshop-details.component';

describe('WorkshopDetailsComponent', () => {
  let component: WorkshopDetailsComponent;
  let fixture: ComponentFixture<WorkshopDetailsComponent>;
  let expectingMatDialogData: object;
  let matDialog: MatDialog;
  let matDialogSpy: jest.SpyInstance;
  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn()
      }
    },
    queryParams: of({ tab: '111' })
  };
  const mockStore = {
    dispatch: jest.fn(),
    select: jest.fn().mockReturnValue(of({})),
    selectSnapshot: jest.fn().mockReturnValue(true)
  };
  const mockActions = {
    pipe: jest.fn().mockReturnValue(of({}))
  };
  const mockImagesService = {
    getCoverImage: jest.fn().mockReturnValue('test-image.jpg'),
    getDefaultCoverImage: jest.fn().mockReturnValue('default-image.jpg')
  };
  const mockNavigationBarService = {
    createNavPaths: jest.fn().mockReturnValue([])
  };
  const mockRouter = {
    navigate: jest.fn()
  } as any;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatTabsModule,
        MatIconModule,
        MatChipsModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        MatDialogModule
      ],
      declarations: [
        WorkshopDetailsComponent,
        MockAllProviderWorkshopsComponent,
        MockProviderAboutComponent,
        MockReviewsComponent,
        MockWorkshopTeachersComponent,
        MockWorkshopAboutComponent,
        ImageCarouselComponent,
        MockActionsComponent,
        ConfirmationModalWindowComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockStore },
        { provide: Actions, useValue: mockActions },
        { provide: ImagesService, useValue: mockImagesService },
        { provide: NavigationBarService, useValue: mockNavigationBarService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopDetailsComponent);
    component = fixture.componentInstance;
    component.workshop = {} as Workshop;
    component.provider = {} as Provider;
    matDialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Action Button', () => {
    beforeEach(() => {
      matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<ConfirmationModalWindowComponent>);
    });

    it('should open confirmation dialog and dispatch SendForModeration on confirm', () => {
      component.workshop = {
        workshopDraftId: '123'
      } as WorkshopDraft;

      expectingMatDialogData = {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.draftSet
        }
      };
      component.onActionButtonClick(ModalConfirmationType.draftSet);
      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(new DraftSendForModeration('123'));
    });

    it('should open confirmation dialog and dispatch ArchiveWorkshop on confirm', () => {
      component.workshop = {
        id: '123'
      } as Workshop;

      expectingMatDialogData = {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.archiveWorkshop
        }
      };

      component.onActionButtonClick(ModalConfirmationType.archiveWorkshop);
      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(new ArchiveWorkshopById('123'));
    });
  });

  it('should set default coverImage', () => {
    const imgEl = fixture.debugElement.query(By.css('img'));
    imgEl.triggerEventHandler('error', {});
    fixture.detectChanges();

    expect(component.isImageBroken).toBe(true);
  });

  describe('onEdit', () => {
    it('should navigate to edit if draft', () => {
      mockActivatedRoute.snapshot.paramMap.get = jest.fn().mockImplementation((key: string) => {
        if (key === 'id') {
          return '123';
        }
        if (key === 'entity') {
          return 'draft';
        }
      });

      component.onEdit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/create/draft', '123']);
    });

    it('should dispatch GetWorkshopDraftIdByWorkshopId if workshop', () => {
      mockActivatedRoute.snapshot.paramMap.get = jest.fn().mockImplementation((key: string) => {
        if (key === 'id') {
          return '123';
        }
        if (key === 'entity') {
          return 'workshop';
        }
      });

      component.onEdit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetWorkshopDraftIdByWorkshopId('123'));
    });
  });

  describe('Tabs', () => {
    it('should change tab and update query params', () => {
      jest.spyOn(mockRouter, 'navigate');

      const mockEvent: Partial<MatTabChangeEvent> = {
        index: 1
      };

      (component as any).onTabChange(mockEvent as MatTabChangeEvent);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [],
        expect.objectContaining({
          queryParams: { tab: 'AboutProvider' }
        })
      );
    });

    it('should change tab according to initial query params', () => {
      mockActivatedRoute.queryParams = of({ tab: 'Teachers' });

      component.ngOnInit();

      expect(component.selectedIndex).toEqual(2);
    });

    it('should change tab to 0 and update query params if initial params arent correct', () => {
      mockActivatedRoute.queryParams = of({ tab: 'UnexistingTab' });
      component.selectedIndex = 1;

      component.ngOnInit();

      expect(component.selectedIndex).toEqual(0);
    });
  });
});

@Component({
  selector: 'app-workshop-about',
  template: ''
})
class MockWorkshopAboutComponent {
  @Input() workshop: Workshop;
}

@Component({
  selector: 'app-workshop-teachers',
  template: ''
})
class MockWorkshopTeachersComponent {
  @Input() teachers: Teacher[];
}

@Component({
  selector: 'app-reviews',
  template: ''
})
class MockReviewsComponent {
  @Input() workshop: Workshop;
  @Input() role: string;
}

@Component({
  selector: 'app-provider-about',
  template: ''
})
class MockProviderAboutComponent {
  @Input() provider: Provider;
}

@Component({
  selector: 'app-all-provider-workshops',
  template: ''
})
class MockAllProviderWorkshopsComponent {
  @Input() workshops: Workshop[];
}

@Component({
  selector: 'app-actions',
  template: ''
})
class MockActionsComponent {
  @Input() role: Role;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;
}
