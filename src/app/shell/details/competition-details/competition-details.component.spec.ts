import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ImageCarouselComponent } from 'shared/components/image-carousel/image-carousel.component';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';

import { Role } from 'shared/enum/role';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';

import { Provider } from 'shared/models/provider.model';
import { Competition } from 'shared/models/competition.model';
import { Judge } from 'shared/models/judge.model';

import { Constants } from 'shared/constants/constants';

import { ImagesService } from 'shared/services/images/images.service';
import { CompetitionDetailsTabTitlesParams } from 'shared/enum/competition';
import { ActivatedRoute, Router } from '@angular/router';
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
      providers: [{ provide: ActivatedRoute, useValue: MockActivatedRoute }],
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

  it('should open confirmation dialog and dispatch PublishWorkshop on confirm', () => {
    expectingMatDialogData = {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.publishCompetition
      }
    };

    matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<ConfirmationModalWindowComponent>);
    component.onActionButtonClick(ModalConfirmationType.publishCompetition);

    expect(matDialogSpy).toHaveBeenCalledTimes(1);
    expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectingMatDialogData);
  });

  it('should load images for carousel and cover image on ngOnInit', () => {
    // Mock the return value for image service
    jest.spyOn(imageService, 'getCarouselImages').mockReturnValue([{ path: 'test/path' }]);
    jest.spyOn(imageService, 'getCoverImage').mockReturnValue('test/coverImage.png');

    component.ngOnInit();

    expect(component.images).toEqual([{ path: 'test/path' }]);
    expect(component.coverImage).toBe('test/coverImage.png');
  });

  it('should call onTabChange and update queryParams', () => {
    const routerNavigateSpy = jest.spyOn(router, 'navigate'); // Spy on navigate
    const event: MatTabChangeEvent = { index: 0, tab: { textLabel: 'Tab 1' } } as any;

    component.onTabChange(event); // Call the method

    // Assert that router.navigate was called with the expected arguments
    expect(routerNavigateSpy).toHaveBeenCalledWith(['./'], {
      relativeTo: route,
      queryParams: { status: CompetitionDetailsTabTitlesParams[0] }
    });
  });
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

// Mock ActivatedRoute
class MockActivatedRoute {
  queryParams = of({}); // Mock queryParams
}
