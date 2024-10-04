import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { HistoryLogTypes } from 'shared/enum/history.log';
import { DropdownData } from 'shared/models/history-log.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { HistoryLogService } from 'shared/services/history-log/history-log.service';
import { HistoryLogComponent } from './history-log.component';

describe('HistoryLogComponent', () => {
  let component: HistoryLogComponent;
  let fixture: ComponentFixture<HistoryLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatTabsModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        HistoryLogComponent,
        NoResultCardComponent,
        MockHistoryLogTableComponent,
        MockHistoryLogPaginatorComponent,
        MockHistoryLogFiltersComponent
      ],
      providers: [HistoryLogService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onTabChange method', () => {
    test.each`
      filters                                                         | expectedFilters
      ${{ AdminType: 'value', OtherProp: 42, from: 0, size: 12 }}     | ${{ OtherProp: 42, from: 0, size: 12 }}
      ${{ OperationType: 'value', OtherProp: 42, from: 0, size: 12 }} | ${{ OtherProp: 42, from: 0, size: 12 }}
      ${{ PropertyName: 'value', OtherProp: 42, from: 0, size: 12 }}  | ${{ OtherProp: 42, from: 0, size: 12 }}
      ${{ ShowParents: 'value', OtherProp: 42, from: 0, size: 12 }}   | ${{ OtherProp: 42, from: 0, size: 12 }}
    `('should remove extra properties from filters object', ({ filters, expectedFilters }) => {
      component.filters = filters;
      const mockEvent = {} as MatTabChangeEvent;

      component.onTabChange(mockEvent);

      expect(component.filters).toEqual(expectedFilters);
    });
  });

  describe('onDateFilter method', () => {
    it('should assign new values to the dateFrom and dateTo in filters object', () => {
      const mockDateFilters = {
        dateFrom: 'Sun Jan 21 2024 11:43:55',
        dateTo: 'Thu Feb 21 2024 05:34:51'
      };
      const expectedFilters = {
        dateFrom: 'Sun Jan 21 2024 11:43:55',
        dateTo: 'Thu Feb 21 2024 05:34:51',
        size: 12
      };

      component.onDateFilter(mockDateFilters);

      expect(component.filters).toEqual(expectedFilters);
    });
  });
});

@Component({
  selector: 'app-history-log-table',
  template: ''
})
class MockHistoryLogTableComponent {
  @Input() table: object[];
  @Input() tableTitle: string;
}

@Component({
  selector: 'app-paginator',
  template: ''
})
class MockHistoryLogPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}

@Component({
  selector: 'app-history-log-filters',
  template: ''
})
class MockHistoryLogFiltersComponent {
  @Input() dropdownOptions: DropdownData[];
  @Input() tabName: HistoryLogTypes;
}
