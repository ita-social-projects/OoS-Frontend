import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { PaginationConstants } from 'shared/constants/constants';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonModule, MatIconModule, MatSelectModule, MatOptionModule, NgxsModule.forRoot([]), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [PaginatorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.itemsPerPage = 8;
    component.totalEntities = 80;
    component.currentPage = { element: PaginationConstants.FIRST_PAGINATION_PAGE, isActive: true };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Page List Creation', () => {
    it('should show first 4 pages when on page 1', () => {
      component.currentPage = { element: 1, isActive: true };
      component.init();

      const expectedPages = [1, 2, 3, 4];
      const actualPages = component.carouselPageList
        .filter((page) => page.element !== PaginationConstants.PAGINATION_DOTS)
        .filter((page) => typeof page.element === 'number')
        .map((page) => page.element);

      expect(actualPages).toEqual([...expectedPages, 10]);
    });

    it('should show correct pages with dots when on page 5', () => {
      component.currentPage = { element: 5, isActive: true };
      component.init();

      const pages = component.carouselPageList.map((page) => page.element);
      expect(pages).toEqual([1, '...', 3, 4, 5, 6, '...', 10]);
    });

    it('should show last 4 pages when on last page', () => {
      component.currentPage = { element: 10, isActive: true };
      component.init();

      const pages = component.carouselPageList.map((page) => page.element);
      expect(pages).toEqual([1, '...', 7, 8, 9, 10]);
    });
  });

  describe('Navigation', () => {
    it('should emit page change event when page is selected', () => {
      const spy = jest.spyOn(component.pageChange, 'emit');
      const newPage: PaginationElement = { element: 2, isActive: true };

      component.onPageChange(newPage);

      expect(spy).toHaveBeenCalledWith(newPage);
    });

    it('should handle forward arrow click', () => {
      const spy = jest.spyOn(component.pageChange, 'emit');
      component.currentPage = { element: 5, isActive: true };

      component.onArroveClick(true);

      expect(spy).toHaveBeenCalledWith({ element: 6, isActive: true });
    });

    it('should handle backward arrow click', () => {
      const spy = jest.spyOn(component.pageChange, 'emit');
      component.currentPage = { element: 5, isActive: true };

      component.onArroveClick(false);

      expect(spy).toHaveBeenCalledWith({ element: 4, isActive: true });
    });
  });

  describe('Items Per Page', () => {
    it('should emit items per page change event', () => {
      const spy = jest.spyOn(component.itemsPerPageChange, 'emit');
      const event = { value: 12 } as any;

      component.OnSelectOption(event);

      expect(spy).toHaveBeenCalledWith(12);
    });

    it('should recalculate total pages when items per page changes', () => {
      component.itemsPerPage = 10;
      component.totalEntities = 100;
      component.init();

      expect(component.totalPageAmount).toBe(10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle small total page count', () => {
      component.totalEntities = 12;
      component.init();

      const pages = component.carouselPageList.map((page) => page.element);
      expect(pages).toEqual([1, 2]);
    });

    it('should handle exactly visible pages count', () => {
      component.totalEntities = 32;
      component.init();

      const pages = component.carouselPageList.map((page) => page.element);
      expect(pages).toEqual([1, 2, 3, 4]);
    });

    it('should handle zero total entities', () => {
      component.totalEntities = 0;
      component.init();

      expect(component.totalPageAmount).toBe(0);
      expect(component.carouselPageList.length).toBe(0);
    });
  });
});
