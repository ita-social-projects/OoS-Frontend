import { Store } from '@ngxs/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  AdminTabsTitles,
} from 'shared/enum/enumUA/tech-admin/admin-tabs';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { GetPlatformInfo } from 'shared/store/admin.actions';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';
import { AdminTabsTitlesParams, AdminTabTypes } from 'shared/enum/admins';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss'],
})
export class PlatformComponent implements OnInit, OnDestroy {
  readonly AdminTabsTitlesParams = AdminTabsTitlesParams;
  readonly AdminTabsTitles = AdminTabsTitles;

  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetPlatformInfo());
    this.addNavPath();
    this.route.queryParams.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe((params: Params) => {
      this.tabIndex = params.page && +AdminTabsTitlesParams[params.page];
    });
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
            disable: false,
          },
          {
            name: NavBarName.Portal,
            path: '/admin-tools/platform',
            queryParams: { page: AdminTabTypes.AboutPortal },
            isActive: false,
            disable: true,
          }
        )
      )
    );
  }

  onSelectedTabChange(event: MatTabChangeEvent): void {
    this.router.navigate(['admin-tools/platform'], { queryParams: { page: AdminTabsTitlesParams[event.index] } });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new DeleteNavPath());
  }
}
