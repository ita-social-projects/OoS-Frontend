import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Role } from 'shared/enum/role';
import { RegistrationState } from 'shared/store/registration.state';
import { canManageInstitution, canManageRegion } from 'shared/utils/admin.utils';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.scss']
})
export class AdminToolsComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.role)
  private role$: Observable<string>;

  public readonly Role = Role;
  public readonly canManageInstitution = canManageInstitution;
  public readonly canManageRegion = canManageRegion;

  public role: Role;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public ngOnInit(): void {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: Role) => (this.role = role));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
