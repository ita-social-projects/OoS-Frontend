import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AboutPortal } from "../models/aboutPortal.model";
import { Department, Direction, DirectionsFilter, IClass } from "../models/category.model";
import { PaginationElement } from "../models/paginationElement.model";
import { CategoriesService } from "../services/categories/categories.service";
import { PortalService } from "../services/portal/portal.service";
import { DeleteDirectionById, GetInfoAboutPortal, OnDeleteDirectionFail, OnDeleteDirectionSuccess, OnUpdateInfoAboutPortalFail, OnUpdateInfoAboutPortalSuccess, UpdateInfoAboutPortal,CreateDirection, OnCreateDirectionFail, OnCreateDirectionSuccess, UpdateDirection, OnUpdateDirectionSuccess, OnUpdateDirectionFail, CreateDepartment, OnCreateDepartmentFail, OnCreateDepartmentSuccess, GetDirectionById, GetDepartmentByDirectionId, SetSearchQueryValue, GetFilteredDirections, PageChange, FilterChange, FilterClear, OnCreateClassFail, OnCreateClassSuccess, CreateClass, } from "./admin.actions";
import { MarkFormDirty, ShowMessageBar } from "./app.actions";

export interface AdminStateModel {
  isLoading: boolean;
  direction: Direction;
  department: Department;
  iClass: IClass[];
  classes: IClass[];
  aboutPortal: AboutPortal;
  departments: Department[];
  selectedDirection: Direction;
  currentPage: PaginationElement;
  searchQuery: string;
  filteredDirections: DirectionsFilter;
}
@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
    direction: undefined,
    department: undefined,
    iClass: [],
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
  }
})
@Injectable()
export class AdminState {
  adminStateModel: any;
  @Selector()
  static aboutPortal(state: AdminStateModel): AboutPortal { return state.aboutPortal; }
  @Selector()
  static direction(state: AdminStateModel): Direction { return state.direction; }
  @Selector()
  static department(state: AdminStateModel): Department { return state.department; }
  @Selector()
  static departments(state: AdminStateModel): Department [] { return state.departments; }
  @Selector()
  static class(state: AdminStateModel): IClass [] { return state.iClass; }
  @Selector()
  static searchQuery(state: AdminStateModel): string { return state.searchQuery }
  @Selector()
  static filteredDirections(state: AdminStateModel): DirectionsFilter{ return state.filteredDirections }
  @Selector()
  static currentPage(state: AdminStateModel): {} { return state.currentPage };
  @Selector()
  static isLoading(state: AdminStateModel): boolean { return state.isLoading };


  constructor(
    private portalService: PortalService,
    private categoriesService: CategoriesService,
    private router: Router,
  ) { }

  @Action(GetInfoAboutPortal)
  getInfoAboutPortal({ patchState }: StateContext<AdminStateModel>): Observable<AboutPortal> {
    return this.portalService
      .getInfoAboutPortal()
      .pipe(
        tap((aboutPortal: AboutPortal) => {
          return patchState({ aboutPortal: aboutPortal });
        }));
  }

  @Action(UpdateInfoAboutPortal)
  updateInfoAboutPortal({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateInfoAboutPortal): Observable<object> {
    return this.portalService
    .updateInfoAboutPortal(payload)
    .pipe(
      tap((res) => dispatch(new OnUpdateInfoAboutPortalSuccess(res))),
      catchError((error: Error) => of(dispatch(new OnUpdateInfoAboutPortalFail(error))))
    );
  }

  @Action(OnUpdateInfoAboutPortalFail)
  OnUpdateInfoAboutPortalFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateInfoAboutPortalFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateInfoAboutPortalSuccess)
  OnUpdateInfoAboutPortalSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateInfoAboutPortalSuccess): void {
    dispatch(new MarkFormDirty(false));
    dispatch(new ShowMessageBar({ message: 'Інформація про портал успішно відредагована', type: 'success' }));
    this.router.navigate(['/admin-tools/platform/about']);
  }

  @Action(DeleteDirectionById)
  DeleteDirectionById({ dispatch }: StateContext<AdminStateModel>, { payload }: DeleteDirectionById): Observable<object> {
    return this.categoriesService
      .deleteDirection(payload)
      .pipe(
        tap((res) => dispatch(new OnDeleteDirectionSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnDeleteDirectionFail(error))))
      );
  }

  @Action(OnDeleteDirectionFail)
  OnDeleteDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDirectionFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteDirectionSuccess)
  OnDeleteDirectionSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDirectionSuccess): void {
    console.log('Direction is deleted', payload);
    dispatch(new ShowMessageBar({ message: 'Напрямок видалено!', type: 'success' }));
    this.router.navigate(['/admin-tools/platform/directions']);
  }

  @Action(CreateDirection)
  CreateDirection({ dispatch }: StateContext<AdminStateModel>, { payload }: CreateDirection): Observable<object> {
    return this.categoriesService
    .createDirection(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateDirectionSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateDirectionFail(error))))
      );
  }

  @Action(OnCreateDirectionFail)
  OnCreateDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateDirectionFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateDirectionSuccess)
  OnCreateDirectionSuccess({ dispatch, patchState }: StateContext<AdminStateModel>, { payload }: OnCreateDirectionSuccess): void {
    dispatch(new MarkFormDirty(false));
    patchState({direction: payload});
    console.log('Direction is created', payload);
    dispatch(new ShowMessageBar({ message: 'Напрямок успішно створенний', type: 'success' }));
  }
  @Action(UpdateDirection)
  updateChild({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateDirection): Observable<object> {
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
    this.router.navigate(['/admin-tools/platform/about']);
  }
  @Action(CreateDepartment)
  CreateDepartment({ dispatch }: StateContext<AdminStateModel>, { payload }: CreateDepartment): Observable<object> {
    return this.categoriesService
      .createDepartment(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateDepartmentSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateDepartmentFail(error))))
      );
  }

  @Action(OnCreateDepartmentFail)
  OnCreateDepartmentFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateDepartmentFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateDepartmentSuccess)
  OnCreateDepartmentSuccess({ dispatch, patchState }: StateContext<AdminStateModel>, { payload }: OnCreateDepartmentSuccess): void {
    dispatch(new MarkFormDirty(false));
    patchState({department: payload});
    console.log('Department is created', payload);
    dispatch(new ShowMessageBar({ message: 'Напрямок успішно створенний', type: 'success' }));
  }

  @Action(CreateClass)
  CreateClass({ dispatch }: StateContext<AdminStateModel>, { payload }: CreateClass): Observable<object> {
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
    patchState({iClass: payload});
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
        tap((direction: Direction) => {
          return patchState({ selectedDirection: direction, isLoading: false });
        }));
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
  FilterClear({ patchState }: StateContext<AdminStateModel>, { }: FilterChange) {
    patchState({
      searchQuery: '',
      currentPage: {
        element: 1,
        isActive: true
      }
    });
  }

}
