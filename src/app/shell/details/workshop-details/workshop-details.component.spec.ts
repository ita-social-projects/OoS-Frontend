import { ImageCarouselComponent } from './../../../shared/components/image-carousel/image-carousel.component';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { Provider } from 'src/app/shared/models/provider.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { WorkshopDetailsComponent } from './workshop-details.component';
import { Role } from 'src/app/shared/enum/role';

describe('WorkshopDetailsComponent', () => {
  let component: WorkshopDetailsComponent;
  let fixture: ComponentFixture<WorkshopDetailsComponent>;
  WorkshopDetailsComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatTabsModule,
        RouterTestingModule,
        MatIconModule,
        MatChipsModule,
        IvyCarouselModule,
        NgxsModule.forRoot([]),
        BrowserAnimationsModule
      ],
      declarations: [
        WorkshopDetailsComponent,
        MockAllProviderWorkshopsComponent,
        MockProviderAboutComponent,
        MockReviewsComponent,
        MockWorkshopTeachersComponent,
        MockWorkshopAboutComponent,
        ImageCarouselComponent,
        MockActionsComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopDetailsComponent);
    component = fixture.componentInstance;
    component.workshop = {} as Workshop;
    component.provider = {} as Provider;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-workshop-about',
  template: ''
})
class MockWorkshopAboutComponent {
  @Input() workshop: Workshop;
}

@Component({
  selector: 'app-workshop-teachers',
  template: ''
})
class MockWorkshopTeachersComponent {
  @Input() teachers: Teacher[];
}

@Component({
  selector: 'app-reviews',
  template: ''
})
class MockReviewsComponent {
  @Input() workshop: Workshop;
  @Input() role: string;
}

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
@Component({
  selector: 'app-actions',
  template: ''
})
class MockActionsComponent {
  @Input() role: Role;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;
}
