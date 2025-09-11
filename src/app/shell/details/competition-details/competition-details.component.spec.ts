import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ImageCarouselComponent } from 'shared/components/image-carousel/image-carousel.component';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Role } from 'shared/enum/role';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Provider } from 'shared/models/provider.model';
import { Competition, CompetitionDraft } from 'shared/models/competition.model';
import { Judge } from 'shared/models/judge.model';
import { Constants } from 'shared/constants/constants';
import { ImagesService } from 'shared/services/images/images.service';
import { Subdirection } from 'shared/models/category.model';
import { ArchiveCompetitionById, CompetitionDraftSendForModeration } from 'shared/store/provider.actions';
import { CompetitionDetailsComponent } from './competition-details.component';

describe('CompetitionDetailsComponent', () => {
  let component: CompetitionDetailsComponent;
  let fixture: ComponentFixture<CompetitionDetailsComponent>;
  let expectingMatDialogData: object;
  let matDialog: MatDialog;
  let matDialogSpy: jest.SpyInstance;
  let imageService: ImagesService;
  let router: Router;
  let route: ActivatedRoute;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatTabsModule,
        RouterTestingModule,
        MatIconModule,
        MatChipsModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        MatDialogModule
      ],
      declarations: [
        CompetitionDetailsComponent,
        MockCompetitionJudgesComponent,
        MockCompetitionAboutComponent,
        ImageCarouselComponent,
        MockActionsComponent,
        ConfirmationModalWindowComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockStore }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionDetailsComponent);
    component = fixture.componentInstance;
    component.competition = {} as Competition;
    component.provider = {} as Provider;
    matDialog = TestBed.inject(MatDialog);
    imageService = TestBed.inject(ImagesService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
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
      component.competition = {
        competitiveEventDraftId: '123'
      } as CompetitionDraft;

      expectingMatDialogData = {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.draftSet
        }
      };
      component.onActionButtonClick(ModalConfirmationType.draftSet);
      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(new CompetitionDraftSendForModeration('123'));
    });

    it('should open confirmation dialog and dispatch ArchiveCompetition on confirm', () => {
      component.competition = {
        id: '123'
      } as Competition;

      expectingMatDialogData = {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.archiveCompetition
        }
      };
      component.onActionButtonClick(ModalConfirmationType.archiveCompetition);
      expect(matDialogSpy).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(new ArchiveCompetitionById('123'));
    });
  });

  it('should load images for carousel and cover image on ngOnInit', () => {
    jest.spyOn(imageService, 'getCarouselImages').mockReturnValue([{ path: 'test/path' }]);
    jest.spyOn(imageService, 'getCoverImage').mockReturnValue('test/coverImage.png');

    component.ngOnInit();

    expect(component.coverImage).toBe('test/coverImage.png');
  });

  it('should call onTabChange and update queryParams', () => {
    const routerNavigateSpy = jest.spyOn(router, 'navigate');
    const event: MatTabChangeEvent = { index: 0, tab: { textLabel: 'Tab 1' } } as any;

    (component as any).onTabChange(event);

    expect(routerNavigateSpy).toHaveBeenCalledWith([], {
      queryParams: { tab: 'AboutCompetition' },
      replaceUrl: true
    });
  });

  it('should get subDirections and save titles for chips', fakeAsync(() => {
    Object.defineProperty(component, 'subDirections$', { writable: true });
    component.subDirections$ = of([
      { id: 1, title: 'Sub1' },
      { id: 2, title: 'Sub2' }
    ] as Subdirection[]);

    component.competition = {
      directionSubDirectionIds: [{ directionId: 1, subDirectionId: 1 }],
      subDirectionIds: [1]
    } as unknown as Competition;

    component.ngOnInit();
    tick();

    expect(component.competitionSubdirections).toEqual(['Sub1']);
  }));
});

@Component({
  selector: 'app-competition-about',
  template: ''
})
class MockCompetitionAboutComponent {
  @Input() competition: Competition;
}

@Component({
  selector: 'app-competition-judges',
  template: ''
})
class MockCompetitionJudgesComponent {
  @Input() judges: Judge[];
}

@Component({
  selector: 'app-actions',
  template: ''
})
class MockActionsComponent {
  @Input() role: Role;
  @Input() competition: Competition;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;
}
