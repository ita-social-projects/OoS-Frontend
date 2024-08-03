import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';

import { Injectable } from '@angular/core';
import { Role } from 'shared/enum/role';
import { Provider } from 'shared/models/provider.model';
import { GetPendingApplicationsByProviderId } from 'shared/store/provider.actions';
import { RegistrationStateModel } from 'shared/store/registration.state';
import { PersonalCabinetComponent } from './personal-cabinet.component';

describe('PersonalCabinetComponent', () => {
  let component: PersonalCabinetComponent;
  let fixture: ComponentFixture<PersonalCabinetComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([MockRegistrationState]), RouterTestingModule, TranslateModule.forRoot()],
      declarations: [PersonalCabinetComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalCabinetComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetPendingApplicationsByProviderId if role is provider', () => {
    jest.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new GetPendingApplicationsByProviderId(mockProvider.id));
  });
});

const mockProvider = { id: 'providerId' } as Provider;

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: { role: Role.provider, provider: mockProvider } as RegistrationStateModel
})
@Injectable()
class MockRegistrationState {}
