import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Select, Store} from "@ngxs/store";
import {filter, takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {AdminState} from "../../../../shared/store/admin.state";
import {MatTabChangeEvent} from "@angular/material/tabs/tab-group";
import {HistoryLogTabsUkr, HistoryLogTabsUkrReverse} from "../../../../shared/enum/enumUA/tech-admin/history-log-tabs";
import {HistoryLogService} from "../../../../shared/services/history-log/history-log.service";
import {
  ApplicationList,
  ProviderAdminList,
  ProviderList
} from "../../../../shared/models/history-log.model";
import {
  GetApplicationHistory,
  GetProviderAdminHistory,
  GetProviderHistory
} from "../../../../shared/store/admin.actions";
import {NoResultsTitle} from "../../../../shared/enum/no-results";

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.scss']
})
export class HistoryLogComponent implements OnInit {

  readonly historyLogTabsUkr = HistoryLogTabsUkr;

  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  @Select(AdminState.providerHistory)
  providersHistory$: Observable<ProviderList>;

  @Select(AdminState.providerAdminHistory)
  providerAdminHistory$: Observable<ProviderAdminList>;

  @Select(AdminState.applicationHistory)
  applicationHistory$: Observable<ApplicationList>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  readonly noHistory = NoResultsTitle.noHistory;
  provider:any = [];
  providerAdmin:any = [];
  application:any = [];
  tableData:any = [];
  tabIndex: number;

  constructor(private historyLogService: HistoryLogService,
              private router: Router,
              private route: ActivatedRoute,
              public store: Store) {}

  ngOnInit(): void {
    this.providersHistory$.pipe(
      takeUntil(this.destroy$),
      filter((provider: ProviderList) => !!provider)
    )
      .subscribe((provider: ProviderList) => {
      this.tableData = provider.entities;
      this.provider = this.tableData;
    })
    this.store.dispatch(new GetProviderHistory());

    this.providerAdminHistory$.pipe(
      takeUntil(this.destroy$),
      filter((providerAdmin: ProviderAdminList) => !!providerAdmin)
    )
      .subscribe((providerAdmin: ProviderAdminList) => {
        this.tableData = providerAdmin.entities;
        this.providerAdmin = this.tableData;
      })
    this.store.dispatch(new GetProviderAdminHistory());

    this.applicationHistory$.pipe(
      takeUntil(this.destroy$),
      filter((application: ApplicationList) => !!application)
    )
      .subscribe((application: ApplicationList) => {
        this.tableData = application.entities;
        this.application = this.tableData;
      })
    this.store.dispatch(new GetApplicationHistory());

  }


  onTabChange(event: MatTabChangeEvent): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab: HistoryLogTabsUkrReverse[event.tab.textLabel] },
    })
  }

  ngOnDestroy () {
    this.destroy$.next(true);
  }

}
