import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ColumnsListForChangesLogHistory } from 'shared/constants/changes-log';
import { Constants } from 'shared/constants/constants';
import { ApplicationTitles } from 'shared/enum/enumUA/statuses';
import { AdminStatus, TypeChange } from 'shared/enum/enumUA/tech-admin/history-log';
import { HistoryLogTypes } from 'shared/enum/history.log';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { ApplicationHistory, ParentsBlockingByAdminHistory, ProviderAdminHistory, ProviderHistory } from 'shared/models/history-log.model';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-history-log-table',
  templateUrl: './history-log-table.component.html',
  styleUrls: ['./history-log-table.component.scss']
})
export class HistoryLogTableComponent implements OnInit, AfterViewInit {
  @Input() public table: (ProviderHistory | ProviderAdminHistory | ApplicationHistory | ParentsBlockingByAdminHistory)[];
  @Input() public tableType: HistoryLogTypes;

  @ViewChild(MatSort) public sort: MatSort;

  public readonly typeChange = TypeChange;
  public readonly HistoryLogTypes = HistoryLogTypes;
  public readonly statusTitles = ApplicationTitles;
  public readonly SHORT_DATE_FORMAT = Constants.SHORT_DATE_FORMAT;
  public readonly FULL_DATE_FORMAT_ONLY_DIGITS = Constants.FULL_DATE_FORMAT_ONLY_DIGITS;
  public readonly adminStatus = AdminStatus;
  public readonly DASH_VALUE = Constants.DASH_VALUE;
  public readonly columnsListForChangesLogHistory = ColumnsListForChangesLogHistory;
  public readonly InfoMenuType = InfoMenuType;

  public getFullName = Util.getFullName;
  public dataSource: MatTableDataSource<object>;

  public get isApplicationHistoryType(): boolean {
    return this.tableType === HistoryLogTypes.Applications;
  }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.table);
    this.dataSource.sortingDataAccessor = (item: ProviderHistory, property): string => {
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
