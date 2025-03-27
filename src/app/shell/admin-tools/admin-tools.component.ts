import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Role } from 'shared/enum/role';
import { RegistrationState } from 'shared/store/registration.state';
import { canManageImports, canManageInstitution, canManageRegion } from 'shared/utils/admin.utils';
import { MetaDataState } from 'shared/store/meta-data.state';
import { FeaturesList } from 'shared/models/features-list.model';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.scss']
})
export class AdminToolsComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.role)
  private role$: Observable<string>;
  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;

  public readonly Role = Role;
  public readonly canManageInstitution = canManageInstitution;
  public readonly canManageRegion = canManageRegion;
  public readonly canManageImports = canManageImports;

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
