import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { ImageCarouselComponent } from '../../../shared/components/image-carousel/image-carousel.component';
import { Provider } from '../../../shared/models/provider.model';
import { Workshop } from '../../../shared/models/workshop.model';
import { ProviderDetailsComponent } from './provider-details.component';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('ProviderDetailsComponent', () => {
  let component: ProviderDetailsComponent;
  let fixture: ComponentFixture<ProviderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTabsModule, RouterTestingModule, MatIconModule, IvyCarouselModule, NgxsModule.forRoot([]), TranslateModule.forRoot(), BrowserAnimationsModule],
      declarations: [ProviderDetailsComponent, MockAllProviderWorkshopsComponent, MockProviderAboutComponent, ImageCarouselComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDetailsComponent);
    component = fixture.componentInstance;
    component.provider = {} as Provider;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-provider-about',
  template: ''
})
class MockProviderAboutComponent {
  @Input() provider: Provider;
}
@Component({
  selector: 'app-all-provider-workshops',
  template: ''
})
class MockAllProviderWorkshopsComponent {
  @Input() workshops: Workshop[];
}
