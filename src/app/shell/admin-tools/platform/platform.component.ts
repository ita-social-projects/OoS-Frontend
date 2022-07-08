import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { GetPlatformInfo } from 'src/app/shared/store/admin.actions';
import { Store } from '@ngxs/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminTabs, AdminTabsUkr } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { AddNavPath, DeleteNavPath, PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';
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
  tabIndex: number = 0;
  type: PlatformInfoType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetPlatformInfo());
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.tabIndex = +this.adminTabs[params.page];
      this.type = PlatformInfoType[params.page];
      this.addNavPath(params.page);
    });
  }

  private addNavPath(activeTab: string): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.Administration,
            path: '/admin-tools/platform',
            queryParams: { page: AdminTabs[0] },
            isActive: false,
            disable: false,
          },
          {
            name: NavBarName.Portal,
            path: '/admin-tools/platform',
            queryParams: { page: AdminTabs[0] },
            isActive: false,
            disable: false,
          },
          {
            name: AdminTabsUkr[activeTab],
            isActive: false,
            disable: true,
          }
        )
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
    this.store.dispatch(new DeleteNavPath());
  }
}
