import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';

import { Constants } from '../../constants/constants';
import { UserStatusesTitles } from '../../enum/enumUA/statuses';
import { Role } from '../../enum/role';
import { EmailConfirmationStatuses, UserStatuses, UserStatusIcons } from '../../enum/statuses';
import { InvitationData, UsersTable } from '../../models/usersTable';
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
  public readonly userStatuses = UserStatuses;
  public readonly statuses = UserStatusesTitles;
  public readonly statusIcons = UserStatusIcons;
  public readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly Role = Role;

  @ViewChild(MatSort)
  private sort: MatSort;

  @Input() public users: Array<object>;
  @Input() public adminType: Role;
  @Input() public displayedColumns: string[] = ['pib', 'email', 'phone', 'role', 'region', 'status', 'actions'];
  @Input() public isEdit: boolean;
  @Input() public statusesTitles: UserStatuses | EmailConfirmationStatuses;

  @Output() public delete = new EventEmitter<UsersTable>();
  @Output() public block = new EventEmitter<UsersTable>();
  @Output() public unblock = new EventEmitter<UsersTable>();
  @Output() public update = new EventEmitter<UsersTable>();
  @Output() public sendInvitation = new EventEmitter<InvitationData>();

  public subrole: string;
  public dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  constructor(private liveAnnouncer: LiveAnnouncer, private store: Store) {}

  public ngOnInit(): void {
    this.subrole = this.store.selectSnapshot<string>(RegistrationState.subrole);
    this.dataSource = new MatTableDataSource(this.users);
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.users && changes.users.currentValue) {
      const users = changes.users.currentValue;
      this.dataSource = new MatTableDataSource(users);
    }
  }

  /** Announce the change in sort state for assistive technology. */
  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }
}
