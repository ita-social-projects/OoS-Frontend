import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { NoResultCardComponent } from '../../../../shared/components/no-result-card/no-result-card.component';
import { DropdownData } from '../../../../shared/models/history-log.model';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { HistoryLogService } from '../../../../shared/services/history-log/history-log.service';
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
      ],
      declarations: [
        HistoryLogComponent,
        NoResultCardComponent,
        MockHistoryLogTableComponent,
        MockHistoryLogPaginatorComponent,
        MockHistoryLogFiltersComponent
      ],
      providers: [HistoryLogService],
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
});

@Component({
  selector: 'app-history-log-table',
  template: '',
})
class MockHistoryLogTableComponent {
  @Input() table: object[];
  @Input() tableTitle: string;
}

@Component({
  selector: 'app-paginator',
  template: '',
})
class MockHistoryLogPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}

@Component({
  selector: 'app-history-log-filters',
  template: '',
})
class MockHistoryLogFiltersComponent {
  @Input() dropdownOptions: DropdownData[];
}

