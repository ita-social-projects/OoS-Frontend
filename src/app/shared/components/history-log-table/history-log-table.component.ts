import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {TypeChange} from "../../enum/enumUA/tech-admin/history-log-tabs";
import {ApplicationTitles} from "../../enum/enumUA/applications";
import {Util} from "../../utils/utils";
import {Provider} from "../../models/history-log.model";

@Component({
  selector: 'app-history-log-table',
  templateUrl: './history-log-table.component.html',
  styleUrls: ['./history-log-table.component.scss']
})
export class HistoryLogTableComponent implements OnInit, AfterViewInit {

  readonly typeChange = TypeChange;
  readonly applicationTitles = ApplicationTitles;
  public util = Util;

  @Input() table: Array<object>;
  @Input() tableTitle: string;

  displayedColumns = ['pib', 'email', 'providerTitle', 'institutionTitle', 'providerCity', 'fieldName', 'updatedDate', 'oldValue', 'newValue'];

  dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.table);

    this.dataSource.sortingDataAccessor = (item:Provider, property) => {
      if (property === 'pib') {
        return item.user.lastName + item.user.firstName + item.user.middleName;
      }
      else if (property === 'email') {
        return item.user.email;
      }
      else {
        return item[property];
      }
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
