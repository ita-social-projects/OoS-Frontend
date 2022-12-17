import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBannerComponent } from './status-banner.component';

describe('FullWidthBannerComponent', () => {
  let component: StatusBannerComponent;
  let fixture: ComponentFixture<StatusBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusBannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
