import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';

import { AdminApplicationsComponent } from './admin-applications.component';

describe('AdminApplicationsComponent', () => {
  let component: AdminApplicationsComponent;
  let fixture: ComponentFixture<AdminApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminApplicationsComponent],
      imports: [NgxsModule.forRoot([]), MatDialogModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
