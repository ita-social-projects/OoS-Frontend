import { MatMenuModule } from '@angular/material/menu';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { Application } from '../../models/application.model';
import { StatusInfoCardComponent } from './status-info-card.component';

describe('StatusInfoCardComponent', () => {
  let component: StatusInfoCardComponent;
  let fixture: ComponentFixture<StatusInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatMenuModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [StatusInfoCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusInfoCardComponent);
    component = fixture.componentInstance;
    component.application = { status: null } as Application;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
