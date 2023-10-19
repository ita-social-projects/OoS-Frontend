import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Util } from '../../../../../shared/utils/utils';
import {
  ApplicationHistory,
  ProviderAdminHistory,
  ProviderHistory,
} from '../../../../../shared/models/history-log.model';
import { Constants } from '../../../../../shared/constants/constants';
import { ApplicationTitles } from '../../../../../shared/enum/enumUA/statuses';
import { HistoryLogTypes } from '../../../../../shared/enum/history.log';
import { AdminStatus, TypeChange } from '../../../../../shared/enum/enumUA/tech-admin/history-log';

@Component({
  selector: 'app-history-log-table',
  templateUrl: './history-log-table.component.html',
  styleUrls: ['./history-log-table.component.scss'],
})
export class HistoryLogTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) public sort: MatSort;

  public readonly typeChange = TypeChange;
  public readonly HistoryLogTypes = HistoryLogTypes;
  public readonly statusTitles = ApplicationTitles;
  public readonly SHORT_DATE_FORMAT = Constants.SHORT_DATE_FORMAT;
  public readonly FULL_DATE_FORMAT_ONLY_DIGITS = Constants.FULL_DATE_FORMAT_ONLY_DIGITS;
  public readonly adminStatus = AdminStatus;
  public readonly DASH_VALUE = Constants.DASH_VALUE;

  @Input() public table: Array<ProviderHistory | ProviderAdminHistory | ApplicationHistory>;
  @Input() public tableType: HistoryLogTypes;

  public getFullName = Util.getFullName;

  public get isApplicationHistoryType(): boolean {
    return this.tableType === HistoryLogTypes.Applications;
  }

  public displayedColumns = [
    'pib',
    'email',
    'providerTitle',
    'institutionTitle',
    'providerCity',
    'fieldName',
    'updatedDate',
    'oldValue',
    'newValue',
  ];

  public displayedProviderAdminsColumns = [
    'pib',
    'email',
    'providerTitle',
    'workshopTitle',
    'institutionTitle',
    'providerCity',
    'fieldName',
    'updatedDate',
    'oldValue',
    'newValue',
  ];
  public dataSource: MatTableDataSource<object>;

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.table);
    this.dataSource.sortingDataAccessor = (item: ProviderHistory, property) => {
      switch (property) {
        case 'pib': {
          return `${item.user.lastName} ${item.user.firstName} ${item.user.middleName}`;
        }
        case 'email': {
          return item.user.email;
        }
        default: {
          return item[property];
        }
      }
    };
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
