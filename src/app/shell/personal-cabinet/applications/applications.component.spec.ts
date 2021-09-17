import { MatTabsModule } from '@angular/material/tabs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationsComponent } from './applications.component';
import { NgxsModule, Store } from '@ngxs/store';
import { InfoBoxHostDirective } from '../../../shared/directives/info-box-host.directive';
import { Component, Input } from '@angular/core';
import { Application } from 'src/app/shared/models/application.model';
import { ApplicationChildFilterPipe } from 'src/app/shared/pipes/application-child-filter.pipe';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { MatDialogModule } from '@angular/material/dialog';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatTabsModule,
        MatDialogModule
      ],
      declarations: [
        ApplicationsComponent,
        InfoBoxHostDirective,
        MockApplicationCardComponent,
        ApplicationChildFilterPipe,
        MockWorkshopChekcboxDropdownComponent,
        NoResultCardComponent
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-application-card',
  template: ''
})
class MockApplicationCardComponent {
  @Input() application: Application;
  @Input() userRole: string;
}

@Component({
  selector: 'app-workshop-checkbox-dropdown',
  template: ''
})
class MockWorkshopChekcboxDropdownComponent {
  @Input() workshops: Workshop[];
}
