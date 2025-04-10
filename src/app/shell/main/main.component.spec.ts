import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, of } from 'rxjs';

import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { Role } from 'shared/enum/role';
import { MockOidcSecurityService } from 'shared/mocks/mock-services';
import { Direction } from 'shared/models/category.model';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { FilterStateModel } from 'shared/models/filter-state.model';
import { Workshop } from 'shared/models/workshop.model';
import { ParentStateModel } from 'shared/store/parent.state';
import { Login } from 'shared/store/registration.actions';
import { RegistrationStateModel } from 'shared/store/registration.state';
import { OnDeleteUnfinishedWorkshop } from 'shared/store/provider.actions';

import { FooterComponent } from '../../footer/footer.component';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let store: Store;
  let router: Router;
  let dialog: MatDialog;

  let hasUnfinishedWorkshopData$: BehaviorSubject<boolean>;
  let isModalShown$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    hasUnfinishedWorkshopData$ = new BehaviorSubject<boolean>(false);
    isModalShown$ = new BehaviorSubject<boolean>(false);
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        NgxsModule.forRoot([MockRegistrationState, MockFilterState, MockParentState]),
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        MatDialogModule,
        RouterTestingModule
      ],
      declarations: [
        MainComponent,
        FooterComponent,
        MockMainCategoryCardComponent,
        MockMainWorkshopCardComponent,
        MockConfirmationModalWindowComponent
      ],
      providers: [
        { provide: OidcSecurityService, useValue: MockOidcSecurityService },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockReturnValue({
              afterClosed: () => of(undefined)
            })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'hasUnfinishedWorkshopData$', {
      get: () => hasUnfinishedWorkshopData$.asObservable()
    });
    Object.defineProperty(component, 'isModalShown$', {
      get: () => isModalShown$.asObservable()
    });
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onRegister and dispatch Login after click register button', () => {
    jest.spyOn(component, 'onRegister');
    jest.spyOn(store, 'dispatch');
    const button = fixture.debugElement.query(By.css('[data-testid="register-button"]'));

    button.nativeElement.click();

    expect(component.onRegister).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new Login(true));
  });
  describe('Draft Functionality', () => {
    it('should continue draft and navigate to create/unfinished', () => {
      jest.spyOn(router, 'navigate');
      component.continueUnfinishedCreation();
      expect(router.navigate).toHaveBeenCalledWith(['/create', 'unfinished']);
    });

    it('should cancel draft and dispatch OnDeleteDraftWorkshop', () => {
      jest.spyOn(store, 'dispatch');
      component.cancelUnfinishedCreation();
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(OnDeleteUnfinishedWorkshop));
    });

    it('should show dialog when draft data exists', () => {
      const showDialogSpy = jest.spyOn(component, 'showDialog');
      hasUnfinishedWorkshopData$.next(true);
      fixture.detectChanges();

      expect(showDialogSpy).toHaveBeenCalledTimes(1);
    });

    it('should not show dialog multiple times', fakeAsync(() => {
      const showDialogSpy = jest.spyOn(component, 'showDialog');
      const dialogSpy = jest.spyOn(dialog, 'open');
      hasUnfinishedWorkshopData$.next(true);
      fixture.detectChanges();
      tick(2000);

      isModalShown$.next(true);
      fixture.detectChanges();

      const initialCalls = showDialogSpy.mock.calls.length;
      const initialDialogCalls = dialogSpy.mock.calls.length;

      hasUnfinishedWorkshopData$.next(true);
      fixture.detectChanges();
      tick(2000);

      expect(showDialogSpy).toHaveBeenCalledTimes(initialCalls);
      expect(dialogSpy).toHaveBeenCalledTimes(initialDialogCalls);
    }));
  });
});

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    isAuthorized: false,
    isLoading: false,
    isAuthorizationLoading: false,
    user: undefined,
    provider: undefined,
    parent: undefined,
    techAdmin: undefined,
    ministryAdmin: undefined,
    regionAdmin: undefined,
    areaAdmin: undefined,
    role: Role.unauthorized
  }
})
@Injectable()
class MockRegistrationState {}

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    ...new DefaultFilterState(),
    settlement: {
      id: 0,
      region: '',
      category: CodeficatorCategories.Region,
      territorialCommunity: '',
      settlement: '',
      cityDistrict: '',
      latitude: 0,
      longitude: 0,
      fullName: ''
    },
    filteredWorkshops: null,
    isLoading: false,
    isConfirmCity: false,
    mapViewCoords: null,
    userRadiusSize: null,
    isMapView: false,
    from: null,
    size: null
  }
})
@Injectable()
class MockFilterState {}

@State<ParentStateModel>({
  name: 'parent',
  defaults: {
    isLoading: false,
    isAllowChildToApply: true,
    isAllowedToReview: false,
    isReviewed: false,
    favoriteWorkshops: [
      {
        workshopId: 'test'
      }
    ],
    favoriteWorkshopsCard: null,
    children: null,
    truncatedItems: null,
    selectedChild: null
  }
})
@Injectable()
class MockParentState {}

@Component({
  selector: 'app-category-card',
  template: ''
})
class MockMainCategoryCardComponent {
  @Input() direction: Direction;
  @Input() workshopsCount: number;
  @Input() icons: {};
}

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockMainWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isCreateFormView: boolean;
}

@Component({
  selector: 'app-confirmation-modal-window',
  template: ''
})
class MockConfirmationModalWindowComponent {
  @Input() data: any;
}
