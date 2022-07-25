import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderOrgInfoComponent } from './provider-org-info.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { PhoneTransformPipe } from 'src/app/shared/pipes/phone-transform.pipe';
import { Component, Input } from '@angular/core';
import { Provider } from 'src/app/shared/models/provider.model';
import { ProviderComponent } from '../provider.component';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';

describe('ProviderOrgInfoComponent', () => {
  let component: ProviderOrgInfoComponent;
  let fixture: ComponentFixture<ProviderOrgInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatIconModule,
        MatTabsModule,
        RouterTestingModule,
        MatDialogModule
      ],
      declarations: [
        ProviderOrgInfoComponent,
        PhoneTransformPipe,
        MockproviderInfoComponent,
        ProviderComponent,
        CabinetDataComponent 
      ],
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
  template: '',
})
class MockproviderInfoComponent {
  @Input() provider: Provider;
  @Input() isProviderView: boolean;
  @Input() currentStatus;
}
