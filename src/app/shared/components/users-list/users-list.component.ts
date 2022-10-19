import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import {
  providerAdminRoleUkr,
  ProviderAdminTitles,
} from '../../enum/enumUA/provider-admin';

import { Role } from '../../enum/role';
import { ProviderAdminIcons, ProviderAdminStatus } from '../../enum/provider-admin';
import { ProviderAdminTable } from '../../models/providerAdmin.model';
import { RegistrationState } from '../../store/registration.state';
import { Constants } from '../../constants/constants';

/**
 * @title Table with sorting
 */
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() users: Array<object>;
  @Input() filterValue: string;
  @Input() displayedColumns: string[] = ['pib', 'email', 'phone', 'place', 'role', 'status', 'actions'];
  @Input() isEdit: boolean;

  @Output() delete = new EventEmitter<ProviderAdminTable>();
  @Output() block = new EventEmitter<ProviderAdminTable>();
  @Output() update = new EventEmitter<ProviderAdminTable>();
  
  readonly providerAdminRoleUkr = providerAdminRoleUkr;
  readonly providerAdminTitles = ProviderAdminTitles;
  readonly providerAdminStatus = ProviderAdminStatus;
  readonly providerAdminIcons = ProviderAdminIcons;
  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;

  subrole: string;
  Role = Role;
  dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  constructor(private liveAnnouncer: LiveAnnouncer, private store: Store) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.subrole = this.store.selectSnapshot<string>(RegistrationState.subrole);
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterValue && changes.filterValue.currentValue) {
      const filter = changes.filterValue.currentValue;
      this.dataSource.filter = filter.trim().toLowerCase();
    } else { this.dataSource.filter = ''; }

    if (changes.users && changes.users.currentValue) {
      const users = changes.users.currentValue;
      this.dataSource = new MatTableDataSource(users);
    }
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  onDelete(user: ProviderAdminTable): void {
    this.delete.emit(user);
  }

  onBlock(user: ProviderAdminTable): void {
   this.block.emit(user);
  }

  onUpdate(user: ProviderAdminTable): void {
    this.update.emit(user);
  }
}
