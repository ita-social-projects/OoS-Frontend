import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ENTER } from '@angular/cdk/keycodes';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { CategoryIcons } from 'shared/enum/category-icons';
import { GetWorkshopDraftIdByWorkshopId } from 'shared/store/provider.actions';
import { Role } from 'shared/enum/role';
// eslint-disable-next-line max-len
import { UnregisteredUserWarningModalComponent } from 'shared/components/unregistered-user-warning-modal/unregistered-user-warning-modal.component';
import { Address } from '../../models/address.model';
import { Teacher } from '../../models/teacher.model';
import { WorkshopCard } from '../../models/workshop.model';
import { WorkshopCardComponent } from './workshop-card.component';

describe('WorkshopCardComponent', () => {
  let component: WorkshopCardComponent;
  let fixture: ComponentFixture<WorkshopCardComponent>;
  const mockStore = {
    dispatch: jest.fn(),
    select: jest.fn().mockReturnValue(of(Role.provider)),
    selectSnapshot: jest.fn().mockReturnValue({ userId: '111' })
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
      declarations: [WorkshopCardComponent, UnregisteredUserWarningModalComponent],
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

  it('keydown', () => {
    const keyboardEvent = new KeyboardEvent('keydown', {
      keyCode: ENTER
    });

    jest.spyOn(component, 'onEdit');
    jest.spyOn(component, 'onLike');
    jest.spyOn(component, 'onDisLike');
    jest.spyOn(component, 'onDelete');
    jest.spyOn(component, 'onOpenDialog');

    component.onEditKeydown(keyboardEvent, '111');
    expect(component.onEdit).toHaveBeenCalled();
    component.onDeleteKeydown(keyboardEvent);
    expect(component.onDelete).toHaveBeenCalled();

    component.role = Role.parent;

    component.onLikeKeydown(keyboardEvent);
    expect(component.onLike).toHaveBeenCalled();
    expect(component.onOpenDialog).not.toHaveBeenCalled();
    component.onDislikeKeydown(keyboardEvent);
    expect(component.onDisLike).toHaveBeenCalled();

    component.role = Role.unauthorized;
    component.onLikeKeydown(keyboardEvent);
    expect(component.onOpenDialog).toHaveBeenCalled();
  });

  it('coverImage error', () => {
    component.onImageError();
    expect(component.isImageBroken).toBeTruthy();

    expect(component.workshopData._meta).toEqual(CategoryIcons['0']);
  });
});
