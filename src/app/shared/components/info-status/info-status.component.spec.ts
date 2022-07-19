import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, _MatMenuDirectivesModule } from '@angular/material/menu';
import { NgxsModule } from '@ngxs/store';
import { Application } from '../../models/application.model';

import { InfoStatusComponent } from './info-status.component';

describe('InfoStatusComponent', () => {
  let component: InfoStatusComponent;
  let fixture: ComponentFixture<InfoStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatMenuModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        _MatMenuDirectivesModule],
      declarations: [InfoStatusComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoStatusComponent);
    component = fixture.componentInstance;
    component.application = { status: null } as Application;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
