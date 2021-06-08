import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopPageComponent } from './workshop-page.component';
import { Component, Input, Provider } from '@angular/core';
import { Workshop } from '../../../shared/models/workshop.model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { Teacher } from '../../../shared/models/teacher.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('WorkshopPageComponent', () => {
  let component: WorkshopPageComponent;
  let fixture: ComponentFixture<WorkshopPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatTabsModule,
        RouterTestingModule
      ],
      declarations: [
        WorkshopPageComponent,
        MockAllProviderWorkshopsComponent,
        MockProviderAboutComponent,
        MockReviewsComponent,
        MockWorkshopTeachersComponent
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
  @Input() provider: Provider;
}
