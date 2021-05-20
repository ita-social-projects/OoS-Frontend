import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderConfigModalComponent } from './provider-config-modal.component';

describe('ProviderConfigModalComponent', () => {
  let component: ProviderConfigModalComponent;
  let fixture: ComponentFixture<ProviderConfigModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderConfigModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
