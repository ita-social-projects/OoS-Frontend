import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopCardComponent } from './workshop-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgxsModule } from '@ngxs/store';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkshopCard } from '../../models/workshop.model';
import { Address } from '../../models/address.model';
import { Teacher } from '../../models/teacher.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

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
        MatChipsModule,
        MatTooltipModule,
        MatDialogModule
      ],
      declarations: [WorkshopCardComponent],
    })
      .compileComponents();
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
        buildingNumber: '',
      } as Address,
      teachers: [{} as Teacher],
    } as unknown as WorkshopCard;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
