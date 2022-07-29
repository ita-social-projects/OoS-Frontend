import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Select, Store} from "@ngxs/store";
import {filter, takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {AdminState} from "../../../../shared/store/admin.state";
import {MatTabChangeEvent} from "@angular/material/tabs/tab-group";
import {HistoryLogTabsUkr, HistoryLogTabsUkrReverse} from "../../../../shared/enum/enumUA/tech-admin/history-log-tabs";
import {HistoryLogService} from "../../../../shared/services/history-log/history-log.service";
import {
  GetApplicationHistory,
  GetProviderAdminHistory,
  GetProviderHistory
} from "../../../../shared/store/admin.actions";
import {NoResultsTitle} from "../../../../shared/enum/no-results";
import {
  ApplicationsHistory,
  ProviderAdminsHistory,
  ProvidersHistory
} from "../../../../shared/models/history-log.model";

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.scss']
})
export class HistoryLogComponent implements OnInit, OnDestroy {

  readonly historyLogTabsUkr = HistoryLogTabsUkr;
  readonly noHistory = NoResultsTitle.noHistory;

  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  @Select(AdminState.providerHistory)
  providersHistory$: Observable<ProvidersHistory>;

  @Select(AdminState.providerAdminHistory)
  providerAdminHistory$: Observable<ProviderAdminsHistory>;

  @Select(AdminState.applicationHistory)
  applicationHistory$: Observable<ApplicationsHistory>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  provider:ProvidersHistory;
  providerAdmin:ProviderAdminsHistory;
  application:ApplicationsHistory;
  tableData:any = [];
  tabIndex: number;

  constructor(private historyLogService: HistoryLogService,
              private router: Router,
              private route: ActivatedRoute,
              public store: Store) {}

  ngOnInit(): void {
    this.providersHistory$.pipe(
      takeUntil(this.destroy$),
      filter((provider: ProvidersHistory) => !!provider)
    )
      .subscribe((provider: ProvidersHistory) => {
      this.tableData = provider.entities;
      this.provider = this.tableData;
    })

    this.providerAdminHistory$.pipe(
      takeUntil(this.destroy$),
      filter((providerAdmin: ProviderAdminsHistory) => !!providerAdmin)
    )
      .subscribe((providerAdmin: ProviderAdminsHistory) => {
        this.tableData = providerAdmin.entities;
        this.providerAdmin = this.tableData;
      })

    this.applicationHistory$.pipe(
      takeUntil(this.destroy$),
      filter((application: ApplicationsHistory) => !!application)
    )
      .subscribe((application: ApplicationsHistory) => {
        this.tableData = application.entities;
        this.application = this.tableData;
      })
    this.store.dispatch([new GetProviderHistory(), new GetProviderAdminHistory(), new GetApplicationHistory()]);
  }


  onTabChange(event: MatTabChangeEvent): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab: HistoryLogTabsUkrReverse[event.tab.textLabel] },
    })
  }

  ngOnDestroy () {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
