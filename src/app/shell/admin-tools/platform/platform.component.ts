import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminTabs, AdminTabsUkr } from 'src/app/shared/enum/enumUA/admin-tabs';
import { Direction } from 'src/app/shared/models/category.model';
import { GetInfoAboutPortal } from 'src/app/shared/store/admin.actions';
import { GetDirections } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit, OnDestroy {

  readonly adminTabs = AdminTabs;
  readonly adminTabsUkr = AdminTabsUkr;

  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  tabIndex: number;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.store.dispatch(new GetDirections());
    this.store.dispatch(new GetInfoAboutPortal());
    this.route.params.pipe(
      takeUntil(this.destroy$))
      .subscribe((params: Params) => this.tabIndex = +this.adminTabs[params.index])
  }

  onSelectedTabChange(event: MatTabChangeEvent): void {
    this.router.navigate([`admin-tools/platform/${this.adminTabs[event.index]}`]);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
