import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  MatIconModule } from '@angular/material/icon';

import { StatusInfoCardComponent } from './status-info-card.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';

describe('StatusInfoCardComponent', () => {
  let component: StatusInfoCardComponent;
  let fixture: ComponentFixture<StatusInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[  
      NgxsModule.forRoot([]),
      MatIconModule,
      MatMenuTrigger, 
      MatMenuModule, 
      MatDialogModule,
      MatDialogRef],
      declarations: [ StatusInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
