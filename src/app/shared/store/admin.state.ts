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
import { DeleteDirectionById, GetInfoAboutPortal, OnDeleteDirectionFail, OnDeleteDirectionSuccess, OnUpdateInfoAboutPortalFail, OnUpdateInfoAboutPortalSuccess, UpdateInfoAboutPortal,CreateDirection, OnCreateDirectionFail, OnCreateDirectionSuccess, UpdateDirection, OnUpdateDirectionSuccess, OnUpdateDirectionFail, CreateDepartment, OnCreateDepartmentFail, OnCreateDepartmentSuccess, GetDirectionById, GetDepartmentByDirectionId, SetSearchQueryValue, GetFilteredDirections, PageChange, FilterChange, FilterClear, OnCreateClassFail, OnCreateClassSuccess, CreateClass, UpdateDepartment, OnUpdateDepartmentFail, OnUpdateDepartmentSuccess, UpdateClass, OnUpdateClassFail, OnUpdateClassSuccess, GetDepartmentById, FilteredDepartmentsList, } from "./admin.actions";
import { MarkFormDirty, ShowMessageBar } from "./app.actions";

export interface AdminStateModel {
  isLoading: boolean;
  direction: Direction;
  department: Department;
  classes: IClass[];
  aboutPortal: AboutPortal;
  departments: Department[];
  selectedDirection: Direction;
  selectedDepartment: Department;
  currentPage: PaginationElement;
  searchQuery: string;
  filteredDirections: DirectionsFilter;
  getDepartments: Department[];
}
@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
    direction: undefined,
    department: undefined,
    classes: [],
    departments: [],
    isLoading: false,
    selectedDirection: null,
    selectedDepartment: null,
    searchQuery: '',
    filteredDirections: undefined,
    getDepartments: [],
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
  static searchQuery(state: AdminStateModel): string { return state.searchQuery; }
  @Selector()
  static filteredDirections(state: AdminStateModel): DirectionsFilter{ return state.filteredDirections; }
  @Selector()
  static getDepartments(state: AdminStateModel): Department[] { return state.getDepartments; }
  @Selector()
  static currentPage(state: AdminStateModel): {} { return state.currentPage; };
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
  onUpdateInfoAboutPortalFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateInfoAboutPortalFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateInfoAboutPortalSuccess)
  onUpdateInfoAboutPortalSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateInfoAboutPortalSuccess): void {
    dispatch(new MarkFormDirty(false));
    dispatch(new ShowMessageBar({ message: 'Інформація про портал успішно відредагована', type: 'success' }));
    this.router.navigate(['/admin-tools/platform/about']);
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
  onUpdateDirectionfail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }
  
  @Action(OnUpdateDirectionSuccess)
  onUpdateDirectionSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Direction is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Напрямок успішно відредагованний', type: 'success' }));
  }

  @Action(UpdateDepartment)
  updateDepartment({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateDepartment): Observable<object> {
    return this.categoriesService
      .updateDepartment(payload)
      .pipe(
        tap((res) => dispatch(new OnUpdateDepartmentSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnUpdateDepartmentFail(error))))
      );
  }
  @Action(OnUpdateDepartmentFail)
  onUpdateDepartmentfail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDepartmentFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }
  
  @Action(OnUpdateDepartmentSuccess)
  onUpdateDepartmentSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDepartmentSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Department is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Відділ успішно відредагованний', type: 'success' }));
  }

  @Action(UpdateClass)
  updateClass({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateClass): Observable<object> {
    return this.categoriesService
      .updateClass(payload)
      .pipe(
        tap((res) => dispatch(new OnUpdateClassSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnUpdateClassFail(error))))
      );
  }
  @Action(OnUpdateClassFail)
  onUpdateClassfail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateClassFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }
  
  @Action(OnUpdateClassSuccess)
  onUpdateClassSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateClassSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Class is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Клас успішно відредагованний', type: 'success' }));
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
    dispatch(new ShowMessageBar({ message: 'Відділ успішно створенний', type: 'success' }));
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
  @Action(GetDepartmentById)
  getDepartmentById({ patchState }: StateContext<AdminStateModel>, { payload }: GetDepartmentById): Observable<Direction> {
    patchState({ isLoading: true });
    return this.categoriesService
      .getDepartmentById(payload)
      .pipe(
        tap((department: Department) =>  patchState({ selectedDepartment: department, isLoading: false })));
  }
  @Action(FilteredDepartmentsList)
  filteredDepartmentsList({ patchState }: StateContext<AdminStateModel>, { payload }: FilteredDepartmentsList): void {
    patchState({ getDepartments: payload });
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
