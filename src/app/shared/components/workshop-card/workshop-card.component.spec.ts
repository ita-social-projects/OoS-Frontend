import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { CategoryIcons } from 'shared/enum/category-icons';
import { GetWorkshopDraftIdByWorkshopId } from 'shared/store/provider.actions';
import { of } from 'rxjs';
import { Role } from 'shared/enum/role';
import { Address } from '../../models/address.model';
import { Teacher } from '../../models/teacher.model';
import { WorkshopCard } from '../../models/workshop.model';
import { WorkshopCardComponent } from './workshop-card.component';

describe('WorkshopCardComponent', () => {
  let component: WorkshopCardComponent;
  let fixture: ComponentFixture<WorkshopCardComponent>;
  const mockStore = {
    dispatch: jest.fn(),
    select: jest.fn().mockReturnValue(of(Role.provider))
  };
  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCardModule,
        NgxsModule.forRoot([]),
        MatChipsModule,
        MatTooltipModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      declarations: [WorkshopCardComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: Router,
          useValue: mockRouter
        }
      ]
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

  describe('onEdit', () => {
    it('should navigate directly if workshopDraftId provided', () => {
      component.onEdit('111');
      expect(mockStore.dispatch).not.toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['create/draft', '111']);
    });

    it('should dispatch check for workshopDraftId if workshopDraftId is not provided', () => {
      component.workshopData = {
        id: '111'
      } as WorkshopCard;
      component.onEdit(undefined);
      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetWorkshopDraftIdByWorkshopId('111'));
    });
  });

  it('coverImage error', () => {
    component.onImageError();
    expect(component.isImageBroken).toBeTruthy();

    expect(component.workshopData._meta).toEqual(CategoryIcons['0']);
  });
});
