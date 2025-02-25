import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { ProviderStatusTitles } from 'shared/enum/enumUA/statuses';
import { UserStatusIcons, UserStatuses } from 'shared/enum/statuses';
import { Provider } from 'shared/models/provider.model';
import { UserWorkshopService } from 'shared/services/workshops/user-workshop/user-workshop.service';
import { BannerMode } from 'shared/enum/bannerMode';
import { ProviderStatusBannerComponent } from './provider-status-banner.component';

describe('FullWidthBannerComponent', () => {
  let component: ProviderStatusBannerComponent;
  let fixture: ComponentFixture<ProviderStatusBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), MatIconModule, HttpClientTestingModule],
      declarations: [ProviderStatusBannerComponent],
      providers: [UserWorkshopService]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderStatusBannerComponent);
    component = fixture.componentInstance;
    const mockElementRef = {
      nativeElement: {
        classList: {
          add: jest.fn(),
          value: ''
        }
      }
    };
    (component as any).elementRef = mockElementRef as any;
    component.mode = BannerMode.Status;
    component.provider = {} as Provider;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set icons, status title and details correctly if provider is blocked', () => {
    component.provider.isBlocked = true;
    component.provider.blockReason = 'Test reason';

    component.ngOnInit();
    (component as any).setBannerOptions();

    expect(component.iconClasses).toEqual(`${UserStatusIcons.Blocked} status-icon`);
    expect(component.statusTitle).toEqual(ProviderStatusTitles[UserStatuses.Blocked]);
    expect(component.statusDetails).toEqual(component.provider.blockReason);
  });
});
