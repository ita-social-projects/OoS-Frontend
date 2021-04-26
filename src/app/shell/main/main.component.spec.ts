import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { MainComponent } from './main.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { FilterState } from 'src/app/shared/store/filter.state';
import { HttpClientModule } from '@angular/common/http';
import { CategoryCardComponent } from 'src/app/shared/components/category-card/category-card.component';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { WorkshopCardComponent } from 'src/app/shared/components/workshop-card/workshop-card.component';
import { UserRegistrationState } from 'src/app/shared/store/user-registration.state';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs'; 

class OidcSecurityServiceStub {
  authorize() {}
  logoff() {}
  getToken(){
    return 'some_token_eVbnasdQ324';
  }
  checkAuth() {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(true);
        subscriber.complete();
      }, 1);
    });
  }
}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainComponent, CategoryCardComponent, WorkshopCardComponent ],
      imports: [NgxsModule.forRoot([FilterState, MetaDataState, UserRegistrationState]), HttpClientModule],
      providers: [{provide: OidcSecurityService, useClass: OidcSecurityServiceStub}],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  describe('User is not authorized', () => {
    beforeEach(() => {
      store = TestBed.inject(Store);
      store.reset({
        ...store.snapshot(),
        filter: {
          organizationCards: [{
            title: 'Org card title',
            owner: 'owner',
            city: 'city',
            address: 'address',
            ownership: 'ownership',
            price: 20,
            rate: '5',
            votes: '10',
            ageFrom: 5,
            ageTo: 8,
            category: ['A', 'B'],
          }],
          categoriesCards: [
            {
              id: 11,
              title: 'Category card title',
              picture: 'pictureData'
            }
          ]
        },
        metaDataState: {
          categoriesIcons: {
            11: 'iconUrl'
          }
        },
        user: {
          isAuthorized: false
        }
      });
      fixture = TestBed.createComponent(MainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('renders org cards with data from store', () => {
      expect(fixture.debugElement.nativeElement.querySelector('.main_cards')).toMatchSnapshot();
    });

    it('renders category cards with data from store', () => {
      expect(fixture.debugElement.nativeElement.querySelector('.main_categories')).toMatchSnapshot();
    });

    it('renders registration block', () => {
      expect(fixture.debugElement.nativeElement.querySelector('.main_registration')).toBeDefined();
    });
  });

  describe('User is authorized', () => {
    beforeEach(() => {
      store = TestBed.inject(Store);
      store.reset({
        ...store.snapshot(),
        filter: {
          organizationCards: [],
          categoriesCards: []
        },
        metaDataState: {
          categoriesIcons: {
            11: 'iconUrl'
          }
        },
        user: {
          isAuthorized: true
        }
      });
      fixture = TestBed.createComponent(MainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('does not render registration block', () => {
      expect(fixture.debugElement.nativeElement.querySelector('.main_registration')).toBe(null);
    });
  });
});
