import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderConfigComponent } from './provider-config.component';

describe('ProviderConfigComponent', () => {
  let component: ProviderConfigComponent;
  let fixture: ComponentFixture<ProviderConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
