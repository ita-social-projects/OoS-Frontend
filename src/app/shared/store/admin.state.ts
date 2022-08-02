import { Action, Selector, State, StateContext } from "@ngxs/store";
import { MarkFormDirty, ShowMessageBar } from "./app.actions";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AdminTabsTitle } from "../enum/enumUA/tech-admin/admin-tabs";
import { CategoriesService } from "../services/categories/categories.service";
import { ChildCards } from "../models/child.model";
import { ChildrenService } from '../services/children/children.service';
import { CompanyInformation } from "../models/сompanyInformation.model";
import { Injectable } from "@angular/core";
import { Parent } from "../models/parent.model";
import { ParentService } from '../services/parent/parent.service';
import { PlatformService } from '../services/platform/platform.service';
import { Provider } from '../models/provider.model';
import { ProviderService } from '../services/provider/provider.service';
import { Router } from "@angular/router";
import {
  GetAboutPortal,
  GetAllProviders,
  GetApplicationHistory,
  GetChildrenForAdmin,
  GetLawsAndRegulations,
  GetParents,
  GetPlatformInfo, GetProviderAdminHistory,
  GetProviderHistory,
  GetSupportInformation,
  OnUpdatePlatformInfoFail,
  OnUpdatePlatformInfoSuccess,
  UpdatePlatformInfo,
} from "./admin.actions";
import {ApplicationsHistory, ProviderAdminsHistory, ProvidersHistory} from "../models/history-log.model";
import {HistoryLogService} from "../services/history-log/history-log.service";

export interface AdminStateModel {
  aboutPortal: CompanyInformation,
  supportInformation: CompanyInformation,
  lawsAndRegulations: CompanyInformation,
  isLoading: boolean;
  parents: Parent[];
  children: ChildCards;
  providers: Provider[];
  providerHistory: ProvidersHistory;
  providerAdminHistory: ProviderAdminsHistory;
  applicationHistory: ApplicationsHistory;
}
@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
    supportInformation: null,
    lawsAndRegulations: null,
    isLoading: false,
    children: null,
    providers: null,
    parents: null,
    providerHistory: null,
    providerAdminHistory: null,
    applicationHistory: null,
  }
})
@Injectable()
export class AdminState {
  adminStateModel: any;

  @Selector() static AboutPortal(state: AdminStateModel): CompanyInformation { return state.aboutPortal; }

  @Selector() static providers(state: AdminStateModel): Provider[] { return state.providers; }

  @Selector() static SupportInformation(state: AdminStateModel): CompanyInformation { return state.supportInformation; }

  @Selector() static LawsAndRegulations(state: AdminStateModel): CompanyInformation { return state.lawsAndRegulations; }

  @Selector() static isLoading(state: AdminStateModel): boolean { return state.isLoading }

  @Selector() static parents(state: AdminStateModel): Parent[] { return state.parents };

  @Selector() static children(state: AdminStateModel): ChildCards { return state.children };

  @Selector() static providerHistory(state: AdminStateModel): ProvidersHistory { return state.providerHistory };

  @Selector() static providerAdminHistory(state: AdminStateModel): ProviderAdminsHistory { return state.providerAdminHistory };

  @Selector() static applicationHistory(state: AdminStateModel): ApplicationsHistory { return state.applicationHistory };

  constructor(
    private platformService: PlatformService,
    private categoriesService: CategoriesService,
    private parentService: ParentService,
    private childrenService: ChildrenService,
    private router: Router,
    private providerService: ProviderService,
    private historyLogService: HistoryLogService,
  ) { }

  @Action(GetPlatformInfo)
  getPlatformInfo({ dispatch }: StateContext<AdminStateModel>, {  }: GetPlatformInfo): void {
    dispatch([
      new GetAboutPortal(),
      new GetSupportInformation(),
      new GetLawsAndRegulations()
    ]);
  }

  @Action(GetAllProviders)
  getAllProviders({ patchState }: StateContext<AdminStateModel>): Observable<Provider[]> {
    patchState({ isLoading: true });
    return this.providerService.getAllProviders().pipe(
      tap((providers: Provider[]) => {
        return patchState({ providers: providers, isLoading: false });
      })
    );
  }

  @Action(GetAboutPortal)
  getAboutPortal({ patchState }: StateContext<AdminStateModel>, {  }: GetAboutPortal): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabsTitle.AboutPortal)
      .pipe(
        tap((aboutPortal: CompanyInformation) => patchState({ aboutPortal: aboutPortal, isLoading: false })));
  }



  @Action(GetSupportInformation)
  getSupportInformation({ patchState }: StateContext<AdminStateModel>, {  }: GetSupportInformation): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabsTitle.SupportInformation)
      .pipe(
        tap((supportInformation: CompanyInformation) => patchState({ supportInformation: supportInformation, isLoading: false })));
  }

  @Action(GetLawsAndRegulations)
  getLawsAndRegulations({ patchState }: StateContext<AdminStateModel>, {  }: GetLawsAndRegulations): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabsTitle.LawsAndRegulations)
      .pipe(
        tap((lawsAndRegulations: CompanyInformation) => patchState({ lawsAndRegulations: lawsAndRegulations, isLoading: false })));
  }

  @Action(UpdatePlatformInfo)
  updatePlatformInfo({ dispatch }: StateContext<AdminStateModel>, { payload, type }: UpdatePlatformInfo): Observable<object> {
    return this.platformService
      .updatePlatformInfo(payload, type)
      .pipe(
        tap((res) => dispatch(new OnUpdatePlatformInfoSuccess(res, type))),
        catchError((error: Error) => of(dispatch(new OnUpdatePlatformInfoFail(error))))
      );
  }

  @Action(OnUpdatePlatformInfoFail)
  onUpdatePlatformInfoFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdatePlatformInfoFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdatePlatformInfoSuccess)
  onUpdatePlatformInfoSuccess({ dispatch }: StateContext<AdminStateModel>, { payload, type }: OnUpdatePlatformInfoSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Інформація про портал успішно відредагована', type: 'success' })
    ]);
    this.router.navigate([`/admin-tools/platform`], { queryParams: { page: type }});
  }

  @Action(GetParents)
  getParents({ patchState }: StateContext<AdminStateModel>, { }: GetParents): Observable<Parent[]> {
    patchState({ isLoading: true });
    return this.parentService
      .getParents()
      .pipe(
        tap((parents: Parent[]) => {
          return patchState({ parents: parents, isLoading: false });
        }));
  }

  @Action(GetChildrenForAdmin)
  getChildrenForAdmin({ patchState }: StateContext<AdminStateModel>, { payload }: GetChildrenForAdmin): Observable<ChildCards> {
    patchState({ isLoading: true });
    return this.childrenService
      .getChildrenForAdmin( payload )
      .pipe(
        tap((children: ChildCards) => {
          return patchState({ children: children, isLoading: false });
        }));
  }

  @Action(GetProviderHistory)
  GetProviderHistory({ patchState }: StateContext<AdminStateModel>): Observable<ProvidersHistory> {
    patchState({ isLoading: true });
    return this.historyLogService.getProviderHistory().pipe(
      tap((providers: ProvidersHistory) => {
        return patchState({ providerHistory: providers, isLoading: false });
      })
    );
  }

  @Action(GetProviderAdminHistory)
  GetProviderAdminHistory({ patchState }: StateContext<AdminStateModel>): Observable<ProviderAdminsHistory> {
    patchState({ isLoading: true });
    return this.historyLogService.getProviderAdminHistory().pipe(
      tap((providerAdmin: ProviderAdminsHistory) => {
        return patchState({ providerAdminHistory: providerAdmin, isLoading: false });
      })
    );
  }

  @Action(GetApplicationHistory)
  GetApplicationHistory({ patchState }: StateContext<AdminStateModel>): Observable<ApplicationsHistory> {
    patchState({ isLoading: true });
    return this.historyLogService.getApplicationHistory().pipe(
      tap((application: ApplicationsHistory) => {
        return patchState({ applicationHistory: application, isLoading: false });
      })
    );
  }
}
