import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { AdminTabTypes, AdminTabsTitlesParams } from 'shared/enum/admins';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { AdminTabsTitles } from 'shared/enum/enumUA/tech-admin/admin-tabs';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { GetPlatformInfo } from 'shared/store/admin.actions';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit, OnDestroy {
  public readonly AdminTabsTitlesParams = AdminTabsTitlesParams;
  public readonly AdminTabsTitles = AdminTabsTitles;

  public tabIndex = 0;

  private destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetPlatformInfo());
    this.addNavPath();
    this.route.queryParams.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe((params: Params) => {
      if (params.page) {
        this.tabIndex = +AdminTabsTitlesParams[params.page];
      }
    });
  }

  public onSelectedTabChange(event: MatTabChangeEvent): void {
    this.router.navigate(['admin-tools/platform'], { queryParams: { page: AdminTabsTitlesParams[event.index] } });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new DeleteNavPath());
  }

  private addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.Administration,
            path: '/admin-tools/platform',
            queryParams: { page: AdminTabTypes.AboutPortal },
            isActive: false,
            disable: false
          },
          {
            name: NavBarName.Portal,
            path: '/admin-tools/platform',
            queryParams: { page: AdminTabTypes.AboutPortal },
            isActive: false,
            disable: true
          }
        )
      )
    );
  }
}
