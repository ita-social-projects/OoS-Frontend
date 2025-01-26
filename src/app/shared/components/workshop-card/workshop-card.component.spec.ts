import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { Address } from '../../models/address.model';
import { Teacher } from '../../models/teacher.model';
import { WorkshopCard } from '../../models/workshop.model';
import { WorkshopCardComponent } from './workshop-card.component';

describe('WorkshopCardComponent', () => {
  let component: WorkshopCardComponent;
  let fixture: ComponentFixture<WorkshopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCardModule,
        NgxsModule.forRoot([]),
        RouterTestingModule,
        MatChipsModule,
        MatTooltipModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      declarations: [WorkshopCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCardComponent);
    component = fixture.componentInstance;
    component.workshop = {
      workshopId: 1,
      title: '',
      phone: '',
      email: '',
      minAge: 1,
      maxAge: 12,
      price: 1,
      description: '',
      direction: '',
      rating: 1,
      directionIds: [],
      address: {
        codeficatorAddressDto: {},
        street: '',
        buildingNumber: ''
      } as Address,
      teachers: [{} as Teacher]
    } as unknown as WorkshopCard;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
