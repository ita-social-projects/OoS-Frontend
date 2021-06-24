import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Nav } from '../../models/navigation.model';
import { Store,NgxsModule } from '@ngxs/store';
import { NavigationBarComponent } from './navigation-bar.component';

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        NgxsModule.forRoot([])
    ],
      declarations: [ NavigationBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store,'selectSnapshot').and.returnValue({} as Nav);
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
