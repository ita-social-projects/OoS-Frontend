import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { Statuses } from '../../enum/statuses';

import { ProviderStatusBannerComponent } from './provider-status-banner.component';

describe('FullWidthBannerComponent', () => {
  let component: ProviderStatusBannerComponent;
  let fixture: ComponentFixture<ProviderStatusBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [ProviderStatusBannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderStatusBannerComponent);
    component = fixture.componentInstance;
    component.providerStatus = { status: Statuses.Accepted, statusReason: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
