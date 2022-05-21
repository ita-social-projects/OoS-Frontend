import { GetPlatformInfo } from 'src/app/shared/store/admin.actions';
import { Select, Store } from '@ngxs/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminTabs, AdminTabsUkr } from 'src/app/shared/enum/enumUA/admin-tabs';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation,  } from 'src/app/shared/models/сompanyInformation.model';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})

export class PlatformComponent implements OnInit, OnDestroy {
  readonly adminTabs = AdminTabs;
  readonly adminTabsUkr = AdminTabsUkr;
  readonly platformInfoType = PlatformInfoType;
  
  @Select(AdminState.AboutPortal)
  AboutPortal$: Observable<CompanyInformation>;
  @Select(AdminState.SupportInformation)
  SupportInformation$: Observable<CompanyInformation>;
  @Select(AdminState.LawsAndRegulations)
  LawsAndRegulations$: Observable<CompanyInformation>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;
  type: PlatformInfoType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.tabIndex = +this.adminTabs[params.index];
        this.type = PlatformInfoType[params.index];
      });
  }

  onSelectedTabChange(event: MatTabChangeEvent): void {
    this.router.navigate([`admin-tools/platform/${this.adminTabs[event.index]}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
