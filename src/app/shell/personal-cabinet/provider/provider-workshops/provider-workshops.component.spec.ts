import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Component, Input } from '@angular/core';
import { NoResultCardComponent } from '../../../../shared/components/no-result-card/no-result-card.component';
import { Workshop } from '../../../../shared/models/workshop.model';
import { ApplicationChildFilterPipe } from '../../../../shared/pipes/application-child-filter.pipe';
import { ApplicationFilterPipe } from '../../../../shared/pipes/application-filter.pipe';
import { ProviderWorkshopsComponent } from './provider-workshops.component';

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
  @Input() isCabinetView: boolean;
}
