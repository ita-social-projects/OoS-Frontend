import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ApplicationFilterPipe } from 'src/app/shared/pipes/application-filter.pipe';
import { ApplicationChildFilterPipe } from 'src/app/shared/pipes/application-child-filter.pipe';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';
import { ProviderWorkshopsComponent } from './provider-workshops.component';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Component, Input } from '@angular/core';
import { Application } from 'src/app/shared/models/application.model';

describe('ProviderAdminWorkshopsComponent', () => {
  let component: ProviderWorkshopsComponent;
  let fixture: ComponentFixture<ProviderWorkshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([]),
        MatDialogModule,
        MatTabsModule
      ],
      declarations: [
        ProviderWorkshopsComponent,
        MockWorkshopCardComponent,
        ApplicationFilterPipe,
        ApplicationChildFilterPipe,
        NoResultCardComponent
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderWorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-workshop-card',
  template: ''
})

class MockWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isMainPage: boolean;
  @Input() userRoleView: string;
  @Input() application: Application;
  @Input() pendingApplications: Application[];
}