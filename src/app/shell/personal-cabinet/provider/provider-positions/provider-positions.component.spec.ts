import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PaginatorComponent } from 'shared/components/paginator/paginator.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DeletePositionById, GetPositions } from 'shared/store/provider.actions';
import { Position } from 'shared/models/position.model';
import { SearchResponse } from 'shared/models/search.model';
import { ProviderPositionsComponent } from './provider-positions.component';

describe('ProviderPositionsComponent', () => {
  let component: ProviderPositionsComponent;
  let fixture: ComponentFixture<ProviderPositionsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatDialogModule,
        MatTableModule,
        TranslateModule.forRoot(),
        MatSelectModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      declarations: [ProviderPositionsComponent, PaginatorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderPositionsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component and set up subscriptions', fakeAsync(() => {
      const valueChangesSpy = jest.spyOn(component.filterFormControl.valueChanges, 'pipe').mockReturnValue(of('test'));

      component.ngOnInit();
      tick(component.debounceInputTime);

      expect(valueChangesSpy).toHaveBeenCalled();
    }));
  });

  describe('onItemsPerPageChange', () => {
    it('should update items per page and fetch positions', () => {
      jest.spyOn(component, 'onPageChange');
      const itemsPerPage = 20;

      component.onItemsPerPageChange(itemsPerPage);

      expect(component.positionParameters.size).toBe(itemsPerPage);
      expect(component.onPageChange).toHaveBeenCalledWith(component.currentPage);
    });
  });

  describe('onDelete', () => {
    it('should dispatch DeletePositionById action', () => {
      const position = { id: '123', providerId: '1', fullName: 'Test Position' } as Position;
      jest.spyOn(store, 'dispatch');

      component.onDelete(position);

      expect(store.dispatch).toHaveBeenCalledWith(new DeletePositionById(component.positionParameters, position.id));
    });
  });

  describe('getPositions', () => {
    it('should dispatch GetPositions action', () => {
      (component as any).provider = { id: '1', providerId: '123', fullName: 'Test Provider' } as Position;
      jest.spyOn(store, 'dispatch');

      (component as any).getPositions();

      expect(store.dispatch).toHaveBeenCalledWith(new GetPositions(component.positionParameters));
    });

    it('should log an error if provider is undefined', () => {
      jest.spyOn(console, 'error');

      (component as any).getPositions();

      expect(console.error).toHaveBeenCalledWith('Provider is undefined, cannot fetch positions.');
    });
  });

  describe('sortData', () => {
    it('should set the correct sort parameters and fetch positions', () => {
      jest.spyOn(component as any, 'getPositions');

      component.sortData({ active: 'orderByFullName', direction: 'asc' });
      expect(component.positionParameters.orderByFullName).toBeTruthy();
      expect(component.positionParameters.orderByCreatedAt).toBeNull();
      expect((component as any).getPositions).toHaveBeenCalled();

      component.sortData({ active: 'orderByFullName', direction: 'desc' });
      expect(component.positionParameters.orderByFullName).toBeFalsy();
      expect(component.positionParameters.orderByCreatedAt).toBeNull();

      component.sortData({ active: 'orderByCreatedAt', direction: 'asc' });
      expect(component.positionParameters.orderByCreatedAt).toBeTruthy();
      expect(component.positionParameters.orderByFullName).toBeNull();

      component.sortData({ active: 'orderByCreatedAt', direction: 'desc' });
      expect(component.positionParameters.orderByCreatedAt).toBeFalsy();
      expect(component.positionParameters.orderByFullName).toBeNull();

      component.sortData({ active: 'orderByCreatedAt', direction: '' });
      expect(component.positionParameters.orderByFullName).toBeNull();
      expect(component.positionParameters.orderByCreatedAt).toBeNull();
    });
  });

  describe('initProviderData', () => {
    it('should initialize provider data and subscribe to positions', () => {
      component.provider = { id: '1', name: 'Test Provider' } as any;
      const mockPositions: SearchResponse<any> = {
        entities: [{ id: '1', name: 'Position 1' }],
        totalAmount: 1
      };
      jest.spyOn(store, 'select').mockReturnValue(of(mockPositions));
      jest.spyOn(component as any, 'getPositions').mockImplementation(() => {});

      component.initProviderData();

      expect((component as any).getPositions).toHaveBeenCalled();

      expect(component.dataSource.data).toEqual(mockPositions.entities);
      expect(component.totalElements).toBe(mockPositions.totalAmount);
    });

    it('should log an error if provider is undefined', () => {
      jest.spyOn(console, 'error');

      component.initProviderData();

      expect(console.error).toHaveBeenCalledWith('Provider is undefined, cannot initialize positions.');
    });
  });
});
