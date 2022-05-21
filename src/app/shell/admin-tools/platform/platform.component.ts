import { GetPlatformInfo } from 'src/app/shared/store/admin.actions';
import { Store } from '@ngxs/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminTabs, AdminTabsUkr } from 'src/app/shared/enum/enumUA/admin-tabs';
import { PlatformInfoType } from 'src/app/shared/enum/platform';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styles: ['@import "src/app/shared/styles/navigation-tabs.scss"; @import "src/app/shared/styles/buttons.scss";']
})

export class PlatformComponent implements OnInit, OnDestroy {
  readonly adminTabs = AdminTabs;
  readonly adminTabsUkr = AdminTabsUkr;
  readonly platformInfoType = PlatformInfoType;

  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;
  type: PlatformInfoType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetPlatformInfo());

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
