import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ProviderStatusBannerComponent } from './provider-status-banner.component';
import { Provider } from '../../models/provider.model';

describe('FullWidthBannerComponent', () => {
  let component: ProviderStatusBannerComponent;
  let fixture: ComponentFixture<ProviderStatusBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), MatIconModule],
      declarations: [ProviderStatusBannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderStatusBannerComponent);
    component = fixture.componentInstance;
    component.provider = { } as Provider;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
