import { MatMenuModule } from '@angular/material/menu';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusInfoCardComponent } from './status-info-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { Application } from '../../models/application.model';

describe('StatusInfoCardComponent', () => {
  let component: StatusInfoCardComponent;
  let fixture: ComponentFixture<StatusInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatMenuModule, MatDialogModule],
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
