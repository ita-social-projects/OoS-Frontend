import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderAdminsComponent } from './provider-admins.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxsModule} from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoResultCardComponent } from '../../../../shared/components/no-result-card/no-result-card.component';
import { Role } from '../../../../shared/enum/role';
import { ProviderAdminTable } from '../../../../shared/models/providerAdmin.model';
import { ProviderAdminsFilterPipe } from '../../../../shared/pipes/provider-admins-filter.pipe';

describe('ProviderAdminsComponent', () => {
  let component: ProviderAdminsComponent;
  let fixture: ComponentFixture<ProviderAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
      ],
      declarations: [
        ProviderAdminsComponent,
        MockUsersListComponent,
        NoResultCardComponent,
        ProviderAdminsFilterPipe,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.subRole = Role.provider;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-users-list',
  template: ''
})
class MockUsersListComponent {
  @Input() providerAdmins: ProviderAdminTable[];
  @Input() users: ProviderAdminTable[];
  @Input() filterValue: string;
  @Input() userType: string;
  @Input() isEdit: boolean;
}
