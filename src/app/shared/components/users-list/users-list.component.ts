import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';

import { BlockData } from 'shared/models/usersTable';
import { Constants } from '../../constants/constants';
import { UserStatusesTitles } from '../../enum/enumUA/statuses';
import { Role } from '../../enum/role';
import { EmailConfirmationStatuses, UserStatuses, UserStatusIcons } from '../../enum/statuses';
import { UsersTable } from '../../models/usersTable';
import { RegistrationState } from '../../store/registration.state';

/**
 * @title Table with sorting
 */
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit, OnChanges {
  readonly statuses = UserStatusesTitles;
  readonly statusIcons = UserStatusIcons;
  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  readonly blockedStatus = 'Blocked';
  readonly Role = Role;

  @ViewChild(MatSort) sort: MatSort;

  @Input() users: Array<object>;
  @Input() adminType: Role;
  @Input() displayedColumns: string[] = ['pib', 'email', 'phone', 'role', 'region', 'status', 'actions'];
  @Input() isEdit: boolean;
  @Input() statusesTitles: UserStatuses | EmailConfirmationStatuses;

  @Output() delete = new EventEmitter<UsersTable>();
  @Output() block = new EventEmitter<BlockData>();
  @Output() update = new EventEmitter<UsersTable>();
  @Output() sendInvitation = new EventEmitter<UsersTable>();

  subrole: string;
  userRole: Role;
  dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  constructor(private liveAnnouncer: LiveAnnouncer, private store: Store) {}

  ngOnInit(): void {
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    this.subrole = this.store.selectSnapshot<string>(RegistrationState.subrole);
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
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
}
