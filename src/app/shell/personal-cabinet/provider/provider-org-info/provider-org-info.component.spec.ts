import { Component, Input, Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { PhonePipe } from 'shared/pipes/phone.pipe';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { ProviderComponent } from '../provider.component';
import { ProviderOrgInfoComponent } from './provider-org-info.component';

describe('ProviderOrgInfoComponent', () => {
  let component: ProviderOrgInfoComponent;
  let fixture: ComponentFixture<ProviderOrgInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatIconModule, MatTabsModule, RouterTestingModule, MatDialogModule],
      declarations: [ProviderOrgInfoComponent, PhonePipe, MockProviderInfoComponent, ProviderComponent, CabinetDataComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderOrgInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-provider-info',
  template: ''
})
class MockProviderInfoComponent {
  @Input() provider: Provider;
  @Input() isProviderView: boolean;
  @Input() currentStatus;
}
