import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { StatusInfoCardComponent } from 'src/app/shared/components/status-info-card/status-info-card.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxsModule, Store } from '@ngxs/store';
import { InfoBoxHostDirective } from '../../../shared/directives/info-box-host.directive';
import { Component, Input } from '@angular/core';
import { Application } from 'src/app/shared/models/application.model';
import { ApplicationChildFilterPipe } from 'src/app/shared/pipes/application-child-filter.pipe';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatTabsModule,
        MatDialogModule,
        MatMenuModule

      ],
      declarations: [
        UsersComponent,
        InfoBoxHostDirective,
        MockApplicationCardComponent,
        ApplicationChildFilterPipe,
        MockWorkshopChekcboxDropdownComponent,
        StatusInfoCardComponent,
        NoResultCardComponent
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
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
