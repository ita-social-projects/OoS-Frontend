import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { Role, Subrole } from 'shared/enum/role';
import { ProviderAdminTable } from 'shared/models/providerAdmin.model';
import { ProviderAdminsComponent } from './provider-admins.component';

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
        TranslateModule.forRoot()
      ],
      declarations: [ProviderAdminsComponent, MockUsersListComponent, NoResultCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.role = Role.provider;
    component.subrole = Subrole.None;
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
  @Input() userType: string;
  @Input() isEdit: boolean;
}
