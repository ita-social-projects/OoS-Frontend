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
import {
  DeleteDirectionById,
  GetInfoAboutPortal,
  OnDeleteDirectionFail,
  OnDeleteDirectionSuccess,
  OnUpdateInfoAboutPortalFail,
  OnUpdateInfoAboutPortalSuccess,
  UpdateInfoAboutPortal,
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
  SetSearchQueryValue,
  GetFilteredDirections,
  PageChange,
  FilterChange,
  FilterClear,
  OnCreateClassFail,
  OnCreateClassSuccess,
  CreateClass,
  UpdateDepartment,
  OnUpdateDepartmentFail,
  OnUpdateDepartmentSuccess,
  UpdateClass,
  OnUpdateClassFail,
  OnUpdateClassSuccess,
  FilteredDepartmentsList,
  DeleteClassById,
  OnDeleteClassSuccess,
  OnDeleteClassFail,
  OnClearCategories,
  DeleteDepartmentById,
  OnDeleteDepartmentFail,
  OnDeleteDepartmentSuccess,
  GetDepartmentById,
  OnClearDepartment,
} from "./admin.actions";
import { MarkFormDirty, ShowMessageBar } from "./app.actions";
import { GetClasses, GetDepartments } from "./meta-data.actions";

export interface AdminStateModel {
  isLoading: boolean;
  direction: Direction;
  department: Department;
  iClass: IClass;
  aboutPortal: AboutPortal;
  currentPage: PaginationElement;
  searchQuery: string;
  filteredDirections: DirectionsFilter;
}
@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
    direction: null,
    department: null,
    iClass: null,
    isLoading: false,
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
  static iClass(state: AdminStateModel): IClass { return state.iClass; }
  @Selector()
  static searchQuery(state: AdminStateModel): string { return state.searchQuery; }
  @Selector()
  static filteredDirections(state: AdminStateModel): DirectionsFilter{ return state.filteredDirections; }
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
    dispatch(new GetDirectionById(payload.id));
    console.log('Direction is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Напрямок успішно відредагованний', type: 'success' }));
  }

  @Action(UpdateDepartment)
  updateDepartment({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateDepartment): Observable<object> {
    return this.categoriesService
      .updateDepartment(payload)
      .pipe(
        tap((department: Department) => dispatch(new OnUpdateDepartmentSuccess(department))),
        catchError((error: Error) => of(dispatch(new OnUpdateDepartmentFail(error))))
      );
  }
  @Action(OnUpdateDepartmentFail)
  onUpdateDepartmentfail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDepartmentFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateDepartmentSuccess)
  onUpdateDepartmentSuccess({ dispatch, patchState }: StateContext<AdminStateModel>, { payload }: OnUpdateDepartmentSuccess): void {
    dispatch(new MarkFormDirty(false));
    dispatch(new GetDepartments(payload.directionId));
    patchState({ department : payload});
    console.log('Department is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Відділ успішно відредагованний', type: 'success' }));
  }

  @Action(UpdateClass)
  updateClass({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateClass): Observable<object> {
    return this.categoriesService
      .updateClass(payload)
      .pipe(
        tap((iClass: IClass) => dispatch(new OnUpdateClassSuccess(iClass))),
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
    dispatch(new GetClasses(payload.departmentId));
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

  @Action(OnCreateClassSuccess)
  onCreateClassSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateClassSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Class is created', payload);
    this.router.navigate([`/admin-tools/platform/directions`]);
    dispatch(new ShowMessageBar({ message: 'Клас успішно створенний', type: 'success' }));
  }

  @Action(OnCreateClassFail)
  onCreateClassFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateClassFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(GetDirectionById)
  getDirectionById({ patchState }: StateContext<AdminStateModel>, { payload }: GetDirectionById): Observable<Direction> {
    patchState({ isLoading: true });
    return this.categoriesService
      .getDirectionById(payload)
      .pipe(
        tap((direction: Direction) =>  patchState({ direction: direction, isLoading: false })));
  }

  @Action(GetDepartmentById)
  getDepartmentById({ patchState }: StateContext<AdminStateModel>, { payload }: GetDepartmentById): Observable<Department>{
    patchState({ isLoading: true });
    return this.categoriesService
      .getDepartmentById(payload)
      .pipe(
        tap((department: Department) =>  patchState({ department: department, isLoading: false })));
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
      () => patchState({ isLoading: false, direction: null })));
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
  @Action(DeleteDepartmentById)
  deleteDepartmentById({ dispatch }: StateContext<AdminStateModel>, { payload }: DeleteDepartmentById): Observable<object> {
    return this.categoriesService
      .deleteDepartmentById(payload.id)
      .pipe(
        tap((res) => dispatch(new OnDeleteDepartmentSuccess(payload))),
        catchError((error: Error) => of(dispatch(new OnDeleteClassFail(error))))
      );
  }

  @Action(OnDeleteDepartmentFail)
  onDeleteDepartmentFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDepartmentFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteDepartmentSuccess)
  onDeleteDepartmentSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDepartmentSuccess): void {
    console.log('Department is deleted', payload);
    dispatch(new GetDepartments(payload.directionId));
    dispatch(new ShowMessageBar({ message: 'Відділення видалено!', type: 'success' }));
  }
  @Action(DeleteClassById)
  deleteClassById({ dispatch }: StateContext<AdminStateModel>, { payload }: DeleteClassById): Observable<object> {
    return this.categoriesService
      .deleteClassById(payload.id)
      .pipe(
        tap(() => dispatch(new OnDeleteClassSuccess(payload))),
        catchError((error: Error) => of(dispatch(new OnDeleteClassFail(error))))
      );
  }

  @Action(OnDeleteClassFail)
  onDeleteClassFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteClassFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteClassSuccess)
  onDeleteClassSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteClassSuccess): void {
    console.log('Class is deleted', payload);
    dispatch(new GetClasses(payload.departmentId)); //TODO: fix teh performance
    dispatch(new ShowMessageBar({ message: 'Класс видалено!', type: 'success' }));
  }

  @Action(OnClearCategories)
  onClearCategories({ patchState }: StateContext<AdminStateModel>, { }: OnClearCategories): void {
    patchState({ direction: null, department: null, iClass: null });
  }

  @Action(OnClearDepartment)
  onClearDepartment({ patchState }: StateContext<AdminStateModel>, { }: OnClearDepartment): void {
    patchState({ department: null });
  }
}
