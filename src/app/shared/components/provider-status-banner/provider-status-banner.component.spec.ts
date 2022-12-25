import { ProviderStatuses } from './../../enum/statuses';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
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
    component.providerStatus = { status: ProviderStatuses.Approved, statusReason: '', isBlocked: false };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
