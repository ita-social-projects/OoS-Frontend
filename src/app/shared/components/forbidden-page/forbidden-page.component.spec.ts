import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { Logout } from 'shared/store/registration.actions';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ForbiddenPageComponent } from './forbidden-page.component';

describe('ForbiddenPageComponent', () => {
  let component: ForbiddenPageComponent;
  let fixture: ComponentFixture<ForbiddenPageComponent>;
  let storeMock: { dispatch: jest.Mock };

  beforeEach(async () => {
    storeMock = {
      dispatch: jest.fn().mockReturnValue(of(true))
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ForbiddenPageComponent],
      providers: [{ provide: Store, useValue: storeMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ForbiddenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch Logout action on onBack()', () => {
    component.onBack();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new Logout());
    expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
  });
});
