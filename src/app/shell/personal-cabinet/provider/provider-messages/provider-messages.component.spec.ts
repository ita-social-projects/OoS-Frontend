import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderMessagesComponent } from './provider-messages.component';

describe('ProviderMessagesComponent', () => {
  let component: ProviderMessagesComponent;
  let fixture: ComponentFixture<ProviderMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
