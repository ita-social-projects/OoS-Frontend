import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDetailsComponent } from './provider-details.component';

describe('ProviderDetailsComponent', () => {
  let component: ProviderDetailsComponent;
  let fixture: ComponentFixture<ProviderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
