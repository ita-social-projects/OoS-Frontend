import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { CompanyInformation, PlatformInfoStateModel } from "../models/сompanyInformation.model";
import { Department, Direction, DirectionsFilter, IClass } from "../models/category.model";
import { PaginationElement } from "../models/paginationElement.model";
import { CategoriesService } from "../services/categories/categories.service";
import { PlatformService } from "../services/platform/platform.service";
import { MarkFormDirty, ShowMessageBar } from "./app.actions";
import { 
  DeleteDirectionById, 
  OnDeleteDirectionFail, 
  OnDeleteDirectionSuccess, 
  CreateDirection, 
  OnCreateDirectionFail, 
  OnCreateDirectionSuccess, 
  UpdateDirection, 
  OnUpdateDirectionSuccess, 
  OnUpdateDirectionFail, 
  CreateDepartment, 
  OnCreateDepartmentFail, 
  OnCreateDepartmentSuccess, 
  GetDirectionById, 
  GetDepartmentByDirectionId, 
  SetSearchQueryValue, 
  GetFilteredDirections, 
  PageChange, 
  FilterChange, 
  FilterClear,
  OnCreateClassFail, 
  OnCreateClassSuccess, 
  CreateClass,
  GetPlatformInfo,
  GetAllProviders,
  UpdatePlatformInfo,
  OnUpdatePlatformInfoSuccess,
  OnUpdatePlatformInfoFail,
  GetAboutPortal,
  GetSupportInformation,
  GetLawsAndRegulations,
} from "./admin.actions";
import { Provider } from '../models/provider.model';
import { ProviderService } from '../services/provider/provider.service';

export interface AdminStateModel {
  aboutPortal: CompanyInformation,
  supportInformation: CompanyInformation,
  lawsAndRegulations: CompanyInformation,
  isLoading: boolean;
  direction: Direction;
  department: Department;
  classes: IClass[];
  departments: Department[];
  selectedDirection: Direction;
  currentPage: PaginationElement;
  searchQuery: string;
  filteredDirections: DirectionsFilter;
  providers: Provider[];
}
@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
    supportInformation: null,
    lawsAndRegulations: null,
    direction: undefined,
    department: undefined,
    classes: [],
    departments: [],
    isLoading: false,
    selectedDirection: null,
    searchQuery: '',
    filteredDirections: undefined,
    currentPage: {
      element: 1,
      isActive: true
    },
    providers: null,
  }
})
@Injectable()
export class AdminState {
  @Selector() static AboutPortal(state: AdminStateModel): CompanyInformation { return state.aboutPortal; }
  
  @Selector() static providers(state: AdminStateModel): Provider[] { return state.providers; }
  
  @Selector() static SupportInformation(state: AdminStateModel): CompanyInformation { return state.supportInformation; }

  @Selector() static LawsAndRegulations(state: AdminStateModel): CompanyInformation { return state.lawsAndRegulations; }

  @Selector() static direction(state: AdminStateModel): Direction { return state.direction; }

  @Selector() static department(state: AdminStateModel): Department { return state.department; }

  @Selector() static departments(state: AdminStateModel): Department [] { return state.departments; }

  @Selector() static searchQuery(state: AdminStateModel): string { return state.searchQuery; }

  @Selector() static filteredDirections(state: AdminStateModel): DirectionsFilter{ return state.filteredDirections; }

  @Selector() static currentPage(state: AdminStateModel): {} { return state.currentPage; }

  @Selector() static isLoading(state: AdminStateModel): boolean { return state.isLoading }

  constructor(
    private platformService: PlatformService,
    private categoriesService: CategoriesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private providerService: ProviderService,
  ) { }

  @Action(GetPlatformInfo)
  getPlatformInfo({ dispatch }: StateContext<AdminStateModel>, {  }: GetPlatformInfo): void {
    dispatch([new GetAboutPortal(), new GetSupportInformation(), new GetLawsAndRegulations()]);
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
      .getPlatformInfo(PlatformInfoType.AboutPortal)
      .pipe(
        tap((aboutPortal: CompanyInformation) => patchState({ aboutPortal: aboutPortal, isLoading: false })));
  }

  

  @Action(GetSupportInformation)
  getSupportInformation({ patchState }: StateContext<AdminStateModel>, {  }: GetSupportInformation): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(PlatformInfoType.SupportInformation)
      .pipe(
        tap((supportInformation: CompanyInformation) => patchState({ supportInformation: supportInformation, isLoading: false })));
  }

  @Action(GetLawsAndRegulations)
  getLawsAndRegulations({ patchState }: StateContext<AdminStateModel>, {  }: GetLawsAndRegulations): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(PlatformInfoType.LawsAndRegulations)
      .pipe(
        tap((lawsAndRegulations: CompanyInformation) => patchState({ lawsAndRegulations: lawsAndRegulations, isLoading: false })));
  }

  @Action(UpdatePlatformInfo)
  updatePlatformInfo({ dispatch }: StateContext<AdminStateModel>, { payload, type }: UpdatePlatformInfo): Observable<object> {
    return this.platformService
      .updatePlatformInfo(payload, type)
      .pipe(
        tap((res) => dispatch(new OnUpdatePlatformInfoSuccess(type))),
        catchError((error: Error) => of(dispatch(new OnUpdatePlatformInfoFail(error))))
      );
  }

  @Action(OnUpdatePlatformInfoFail)
  onUpdatePlatformInfoFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdatePlatformInfoFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdatePlatformInfoSuccess)
  onUpdatePlatformInfoSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdatePlatformInfoSuccess): void {
    dispatch(new MarkFormDirty(false));
    dispatch(new ShowMessageBar({ message: 'Інформація про портал успішно відредагована', type: 'success' }));

    this.router.navigate([`/admin-tools/platform/${payload}`]);
  }

  @Action(DeleteDirectionById)
  deleteDirectionById({ dispatch }: StateContext<AdminStateModel>, { payload }: DeleteDirectionById): Observable<object> {
    return this.categoriesService
      .deleteDirection(payload)
      .pipe(
        tap((res) => dispatch(new OnDeleteDirectionSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnDeleteDirectionFail(error))))
      );
  }

  @Action(OnDeleteDirectionFail)
  onDeleteDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDirectionFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteDirectionSuccess)
  onDeleteDirectionSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDirectionSuccess): void {
    console.log('Direction is deleted', payload);
    dispatch(new ShowMessageBar({ message: 'Напрямок видалено!', type: 'success' }));
    this.router.navigate(['/admin-tools/platform/directions']);
  }

  @Action(CreateDirection)
  createDirection({ dispatch }: StateContext<AdminStateModel>, { payload }: CreateDirection): Observable<object> {
    return this.categoriesService
    .createDirection(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateDirectionSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateDirectionFail(error))))
      );
  }

  @Action(OnCreateDirectionFail)
  onCreateDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateDirectionFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateDirectionSuccess)
  onCreateDirectionSuccess({ dispatch, patchState }: StateContext<AdminStateModel>, { payload }: OnCreateDirectionSuccess): void {
    dispatch(new MarkFormDirty(false));
    patchState({direction: payload});
    console.log('Direction is created', payload);
    dispatch(new ShowMessageBar({ message: 'Напрямок успішно створенний', type: 'success' }));
  }
  @Action(UpdateDirection)
  updateDirection({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateDirection): Observable<object> {
    return this.categoriesService
      .updateDirection(payload)
      .pipe(
        tap((res) => dispatch(new OnUpdateDirectionSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnUpdateDirectionFail(error))))
      );
  }
  @Action(OnUpdateDirectionFail)
  onUpdateChildfail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }
  
  @Action(OnUpdateDirectionSuccess)
  onUpdateChildSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Direction is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Дитина успішно відредагована', type: 'success' }));
    this.router.navigate(['/admin-tools/platform/directions']);
  }

  @Action(CreateDepartment)
  createDepartment({ dispatch }: StateContext<AdminStateModel>, { payload }: CreateDepartment): Observable<object> {
    return this.categoriesService
      .createDepartment(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateDepartmentSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateDepartmentFail(error))))
      );
  }

  @Action(OnCreateDepartmentFail)
  onCreateDepartmentFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateDepartmentFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateDepartmentSuccess)
  onCreateDepartmentSuccess({ dispatch, patchState }: StateContext<AdminStateModel>, { payload }: OnCreateDepartmentSuccess): void {
    dispatch(new MarkFormDirty(false));
    patchState({department: payload});
    console.log('Department is created', payload);
    dispatch(new ShowMessageBar({ message: 'Напрямок успішно створенний', type: 'success' }));
  }

  @Action(CreateClass)
  createClass({ dispatch }: StateContext<AdminStateModel>, { payload }: CreateClass): Observable<object> {
    return this.categoriesService
      .createClass(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateClassSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateClassFail(error))))
      );
  }

  @Action(OnCreateClassFail)
  onCreateClassFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateClassFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateClassSuccess)
  onCreateClassSuccess({ dispatch,patchState }: StateContext<AdminStateModel>, { payload }: OnCreateClassSuccess): void {
    dispatch(new MarkFormDirty(false));
    patchState({classes: payload});
    console.log('Class is created', payload);
    dispatch(new ShowMessageBar({ message: 'Клас успішно створенний', type: 'success' }));
    this.router.navigate(['/admin-tools/platform/directions']);
    this.getFilteredDirections;
  }

  @Action(GetDirectionById)
  getDirectionById({ patchState }: StateContext<AdminStateModel>, { payload }: GetDirectionById): Observable<Direction> {
    patchState({ isLoading: true });
    return this.categoriesService
      .getDirectionById(payload)
      .pipe(
        tap((direction: Direction) =>  patchState({ selectedDirection: direction, isLoading: false })));
  }

  @Action(GetDepartmentByDirectionId)
  getDepartmentByDirectionId({ patchState }: StateContext<AdminStateModel>, { payload }: GetDepartmentByDirectionId): Observable<Department[]> {
    patchState({ isLoading: true });
    return this.categoriesService
      .getDepartmentsByDirectionId(payload)
      .pipe(
        tap((department: Department[]) => {
          return patchState({ departments: department, isLoading: false });
        }));
  }

  @Action(SetSearchQueryValue)
  setSearchQueryValue({ patchState, dispatch }: StateContext<AdminStateModel>, { payload }: SetSearchQueryValue) {
    patchState({ searchQuery: payload });
    dispatch(new FilterChange());
  }

  @Action(FilterChange)
  filterChange({ }: StateContext<AdminStateModel>, { }: FilterChange) { }


  @Action(GetFilteredDirections)
  getFilteredDirections({ patchState, getState }: StateContext<AdminStateModel>, { }: GetFilteredDirections) {
    patchState({ isLoading: true });
    const state: AdminStateModel = getState();
    return this.categoriesService
      .getFilteredDirections( state)
      .pipe(tap((filterResult: DirectionsFilter) => patchState(filterResult ? { filteredDirections: filterResult, isLoading: false } : { filteredDirections: undefined, isLoading: false }),
      () => patchState({ isLoading: false, selectedDirection: null })));
  }

    @Action(PageChange)
    pageChange({ patchState, dispatch }: StateContext<AdminStateModel>, { payload }: PageChange): void {
      patchState({ currentPage: payload });
      dispatch(new GetFilteredDirections());
    }

    @Action(FilterClear)
    filterClear({ patchState }: StateContext<AdminStateModel>, { }: FilterChange) {
    patchState({
      searchQuery: '',
      currentPage: {
        element: 1,
        isActive: true
      }
    });
  }
}