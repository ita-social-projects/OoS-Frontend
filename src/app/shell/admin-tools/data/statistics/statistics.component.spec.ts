import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';

import { PaginationElement } from 'shared/models/pagination-element.model';
import { DownloadStatisticReport, GetStatisticReports } from 'shared/store/admin.actions';
import { AdminStateModel } from 'shared/store/admin.state';
import { StatisticsComponent } from './statistics.component';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticsComponent, MockNoResultCardComponent],
      imports: [
        NgxsModule.forRoot([MockAdminState]),
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatSelectModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetStatisticReports with new parameters when onItemsPerPageChange called', () => {
    const expectedStatisticParametersSize = 20;
    component.statisticParameters.size = 10;
    jest.spyOn(store, 'dispatch');

    component.onItemsPerPageChange(expectedStatisticParametersSize);

    expect(component.statisticParameters.size).toEqual(expectedStatisticParametersSize);
    expect(store.dispatch).toHaveBeenCalledWith(new GetStatisticReports(component.statisticParameters));
  });

  it('should dispatch GetStatisticReports with new parameters when onPageChange called', () => {
    const expectedPage: PaginationElement = { element: 3, isActive: true };
    component.currentPage.element = 5;
    jest.spyOn(store, 'dispatch');

    component.onPageChange(expectedPage);

    expect(component.currentPage).toEqual(expectedPage);
    expect(store.dispatch).toHaveBeenCalledWith(new GetStatisticReports(component.statisticParameters));
  });

  it('should dispatch GetStatisticReports when onGenerateReport called', () => {
    jest.spyOn(store, 'dispatch');

    component.onGenerateReport();

    expect(store.dispatch).toHaveBeenCalledWith(new GetStatisticReports(component.statisticParameters));
  });

  it('should dispatch DownloadStatisticReport when onLoadReport called', () => {
    const expectedReportId = 'reportId';
    jest.spyOn(store, 'dispatch');

    component.onLoadReport(expectedReportId);

    expect(store.dispatch).toHaveBeenCalledWith(new DownloadStatisticReport(expectedReportId));
  });
});

@Component({
  selector: 'app-no-result-card',
  template: ''
})
export class MockNoResultCardComponent {
  @Input() public title: string;
}

@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    statisticsReports: { entities: [], totalAmount: 0 },
    downloadedReport: { body: 'reportBody' } as any
  } as AdminStateModel
})
@Injectable()
class MockAdminState {}
