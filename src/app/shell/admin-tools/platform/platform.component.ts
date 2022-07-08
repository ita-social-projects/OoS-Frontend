import { GetPlatformInfo } from 'src/app/shared/store/admin.actions';
import { Store } from '@ngxs/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminTabs, AdminTabsUkr } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss'],
})
export class PlatformComponent implements OnInit, OnDestroy {
  readonly adminTabs = AdminTabs;
  readonly adminTabsUkr = AdminTabsUkr;
  readonly platformInfoType = PlatformInfoType;

  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;
  type: PlatformInfoType;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.addNavPath();
    this.store.dispatch(new GetPlatformInfo());
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.tabIndex = +this.adminTabs[params.page];
      this.type = PlatformInfoType[params.page];
      this.store.dispatch(
        new PushNavPath(
          {
            name: AdminTabsUkr[params.page],
            isActive: false,
            disable: true,
          },
        ),
      );
    });
  }

  private addNavPath(): void {
    this.store.dispatch(
      new PushNavPath(
        {
          name: NavBarName.Portal,
          path: '/admin-tools/platform',
          queryParams: { 'page': AdminTabs.AboutPortal },
          isActive: false,
          disable: false,
        },
      )
    );
  }

  onSelectedTabChange(event: MatTabChangeEvent): void {
    this.store.dispatch(new PopNavPath());
    this.router.navigate([`admin-tools/platform`], { queryParams: { page: this.adminTabs[event.index] } });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
