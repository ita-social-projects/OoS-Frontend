import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderAboutComponent } from './provider-about.component';

describe('ProviderAboutComponent', () => {
  let component: ProviderAboutComponent;
  let fixture: ComponentFixture<ProviderAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderAboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
