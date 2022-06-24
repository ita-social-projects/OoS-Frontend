import { StatusInfoCardComponent } from 'src/app/shared/components/status-info-card/status-info-card.component';
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
import { MatMenuModule } from '@angular/material/menu';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationChildSortingPipe } from 'src/app/shared/pipes/application-child-sorting.pipe';
import { WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatTabsModule,
        MatDialogModule,
        MatMenuModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        ApplicationsComponent,
        InfoBoxHostDirective,
        MockApplicationCardComponent,
        ApplicationChildFilterPipe,
        ApplicationChildSortingPipe,
        MockWorkshopChekcboxDropdownComponent,
        StatusInfoCardComponent,
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
  selector: 'app-entity-checkbox-dropdown',
  template: ''
})
class MockWorkshopChekcboxDropdownComponent {
  @Input() entities: Workshop[];
  @Input() declination: WorkshopDeclination
}
