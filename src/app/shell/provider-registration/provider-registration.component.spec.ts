import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderRegistrationComponent } from './provider-registration.component';

describe('ProviderRegistrationComponent', () => {
  let component: ProviderRegistrationComponent;
  let fixture: ComponentFixture<ProviderRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
