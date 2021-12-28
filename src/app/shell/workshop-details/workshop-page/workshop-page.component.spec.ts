import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopPageComponent } from './workshop-page.component';
import { Component, Input, Provider } from '@angular/core';
import { Workshop } from '../../../shared/models/workshop.model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { Teacher } from '../../../shared/models/teacher.model';
import { RouterTestingModule } from '@angular/router/testing';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { NgxsModule } from '@ngxs/store';

describe('WorkshopPageComponent', () => {
  let component: WorkshopPageComponent;
  let fixture: ComponentFixture<WorkshopPageComponent>;

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
      ],
      declarations: [
        WorkshopPageComponent,
        MockAllProviderWorkshopsComponent,
        MockProviderAboutComponent,
        MockReviewsComponent,
        MockWorkshopTeachersComponent,
        MockWorkshopAboutComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopPageComponent);
    component = fixture.componentInstance;
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
  @Input() providerWorkshops: Workshop[];
  @Input() role: string;
}
