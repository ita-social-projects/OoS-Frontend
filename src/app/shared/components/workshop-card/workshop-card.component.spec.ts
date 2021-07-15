import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopCardComponent } from './workshop-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgxsModule } from '@ngxs/store';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { Workshop } from '../../models/workshop.model';
import { Address } from '../../models/address.model';
import { Teacher } from '../../models/teacher.model';
import { MatChipsModule } from '@angular/material/chips';
import { Application } from '../../models/application.model';

describe('WorkshopCardComponent', () => {
  let component: WorkshopCardComponent;
  let fixture: ComponentFixture<WorkshopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCardModule,
        NgxsModule.forRoot([]),
        FlexLayoutModule,
        RouterTestingModule,
        MatChipsModule
      ],
      declarations: [WorkshopCardComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCardComponent);
    component = fixture.componentInstance;
    component.status = '';
    component.application = {status: null} as Application;
    component.workshop = {
      id: 1,
      title: '',
      phone: '',
      email: '',
      minAge: 1,
      maxAge: 12,
      daysPerWeek: 3,
      ownership: '',
      rate: '',
      price: 1,
      description: '',
      head: '',
      address: {
        city: '',
        street: '',
        buildingNumber: '',
      } as Address,
      teachers: [{} as Teacher],
    } as Workshop;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
