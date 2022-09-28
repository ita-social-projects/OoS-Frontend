import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { Navigation } from '../../models/navigation.model';
import { NavigationMobileBarComponent } from './navigation-mobile-bar.component';

describe('NavigationMobileBarComponent', () => {
  let component: NavigationMobileBarComponent;
  let fixture: ComponentFixture<NavigationMobileBarComponent>;
  let store: Store;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [NavigationMobileBarComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of({} as Navigation));
    fixture = TestBed.createComponent(NavigationMobileBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
