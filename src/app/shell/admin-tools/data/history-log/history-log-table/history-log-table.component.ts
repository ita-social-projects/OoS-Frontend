import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TypeChange } from '../../../../../shared/enum/enumUA/tech-admin/history-log-tabs';
import { Util } from '../../../../../shared/utils/utils';
import {
  ApplicationHistory,
  ProviderAdminHistory,
  ProviderHistory,
} from '../../../../../shared/models/history-log.model';
import { Constants } from '../../../../../shared/constants/constants';
import { ApplicationTitles } from '../../../../../shared/enum/enumUA/applications';

@Component({
  selector: 'app-history-log-table',
  templateUrl: './history-log-table.component.html',
  styleUrls: ['./history-log-table.component.scss'],
})
export class HistoryLogTableComponent implements OnInit, AfterViewInit {
  readonly typeChange = TypeChange;
  readonly statusTitles = ApplicationTitles;
  readonly SHORT_DATE_FORMAT = Constants.SHORT_DATE_FORMAT;
  public util = Util;

  @Input() table: Array<ProviderHistory | ProviderAdminHistory | ApplicationHistory>;
  @Input() tableTitle: string;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
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
  dataSource: MatTableDataSource<object>;

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
