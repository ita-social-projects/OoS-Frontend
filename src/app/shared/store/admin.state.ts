import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Department, Direction, DirectionsFilter, IClass } from "../models/category.model";
import { GetClasses, GetDepartments } from "./meta-data.actions";
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
  CreateClass,
  CreateDepartment,
  CreateDirection,
  DeleteClassById,
  DeleteDepartmentById,
  DeleteDirectionById,
  GetAboutPortal,
  GetAllProviders,
  GetChildrenForAdmin,
  GetDepartmentById,
  GetDirectionById,
  GetFilteredDirections,
  GetLawsAndRegulations,
  GetParents,
  GetPlatformInfo,
  GetSupportInformation,
  OnClearCategories,
  OnClearDepartment,
  OnCreateClassFail,
  OnCreateClassSuccess,
  OnCreateDepartmentFail,
  OnCreateDepartmentSuccess,
  OnCreateDirectionFail,
  OnCreateDirectionSuccess,
  OnDeleteClassFail,
  OnDeleteClassSuccess,
  OnDeleteDepartmentFail,
  OnDeleteDepartmentSuccess,
  OnDeleteDirectionFail,
  OnDeleteDirectionSuccess,
  OnUpdateClassFail,
  OnUpdateClassSuccess,
  OnUpdateDepartmentFail,
  OnUpdateDepartmentSuccess,
  OnUpdateDirectionFail,
  OnUpdateDirectionSuccess,
  OnUpdatePlatformInfoFail,
  OnUpdatePlatformInfoSuccess,
  UpdateClass,
  UpdateDepartment,
  UpdateDirection,
  UpdatePlatformInfo,
} from "./admin.actions";

export interface AdminStateModel {
  aboutPortal: CompanyInformation,
  supportInformation: CompanyInformation,
  lawsAndRegulations: CompanyInformation,
  isLoading: boolean;
  direction: Direction;
  department: Department;
  departments: Department[];
  selectedDirection: Direction;
  filteredDirections: DirectionsFilter;
  parents: Parent[];
  children: ChildCards;
  providers: Provider[];
}
@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
    supportInformation: null,
    lawsAndRegulations: null,
    direction: null,
    department: null,
    departments: null,
    isLoading: false,
    filteredDirections: undefined,
    selectedDirection: null,
    children: null,
    providers: null,
    parents: null,
  }
})
@Injectable()
export class AdminState {
  adminStateModel: any;

  @Selector() static AboutPortal(state: AdminStateModel): CompanyInformation { return state.aboutPortal; }

  @Selector() static providers(state: AdminStateModel): Provider[] { return state.providers; }

  @Selector() static SupportInformation(state: AdminStateModel): CompanyInformation { return state.supportInformation; }

  @Selector() static LawsAndRegulations(state: AdminStateModel): CompanyInformation { return state.lawsAndRegulations; }

  @Selector() static direction(state: AdminStateModel): Direction { return state.direction; }

  @Selector() static department(state: AdminStateModel): Department { return state.department; }

  @Selector() static departments(state: AdminStateModel): Department [] { return state.departments; }

  @Selector() static filteredDirections(state: AdminStateModel): DirectionsFilter{ return state.filteredDirections; }

  @Selector() static isLoading(state: AdminStateModel): boolean { return state.isLoading }

  @Selector() static parents(state: AdminStateModel): Parent[] { return state.parents };

  @Selector() static children(state: AdminStateModel): ChildCards { return state.children };

  constructor(
    private platformService: PlatformService,
    private categoriesService: CategoriesService,
    private parentService: ParentService,
    private childrenService: ChildrenService,
    private router: Router,
    private providerService: ProviderService,
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
    dispatch([
      new ShowMessageBar({ message: 'Напрямок видалено!', type: 'success' }),
      new GetFilteredDirections()
    ]);
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
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Напрямок успішно створенний', type: 'success' })
    ]);
    patchState({direction: payload});
    console.log('Direction is created', payload);
  }
  @Action(UpdateDirection)
  updateDirection({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateDirection): Observable<Direction | Observable<void>> {
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
    dispatch([
      new MarkFormDirty(false),
      new GetDirectionById(payload.id),
      new ShowMessageBar({ message: 'Напрямок успішно відредагованний', type: 'success' })
    ]);
    console.log('Direction is updated', payload);
  }

  @Action(UpdateDepartment)
  updateDepartment({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateDepartment): Observable<Department | Observable<void>> {
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
    dispatch([
      new MarkFormDirty(false),
      new GetDepartments(payload.directionId),
      new ShowMessageBar({ message: 'Відділ успішно відредагованний', type: 'success' })
    ]);
    patchState({ department : payload});
    console.log('Department is updated', payload);
  }

  @Action(UpdateClass)
  updateClass({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateClass): Observable<IClass | Observable<void>> {
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
    dispatch([
      new MarkFormDirty(false),
      new GetClasses(payload.departmentId),
      new ShowMessageBar({ message: 'Клас успішно відредагованний', type: 'success' })
    ]);
    console.log('Class is updated', payload);
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
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Відділ успішно створенний', type: 'success' })
    ]);
    patchState({department: payload});
    console.log('Department is created', payload);
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
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Клас успішно створенний', type: 'success' })
    ]);
    console.log('Class is created', payload);
    this.router.navigate([`/admin-tools/platform/directions`]);
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

  @Action(GetFilteredDirections)
  getFilteredDirections({ patchState, getState }: StateContext<AdminStateModel>, { payload }: GetFilteredDirections) {
    patchState({ isLoading: true });
    return this.categoriesService
      .getFilteredDirections(payload)
      .pipe(tap((filterResult: DirectionsFilter) => patchState(filterResult ? { filteredDirections: filterResult, isLoading: false } : { filteredDirections: undefined, isLoading: false }),
      () => patchState({ isLoading: false, direction: null })));
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
    dispatch([
      new GetDepartments(payload.directionId),
      new ShowMessageBar({ message: 'Відділення видалено!', type: 'success' })
    ]);
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
    dispatch([
      new GetClasses(payload.departmentId), //TODO: fix the performance
      new ShowMessageBar({ message: 'Класс видалено!', type: 'success' })
    ]);
  }

  @Action(OnClearCategories)
  onClearCategories({ patchState }: StateContext<AdminStateModel>, { }: OnClearCategories): void {
    patchState({ direction: null, department: null });
  }

  @Action(OnClearDepartment)
  onClearDepartment({ patchState }: StateContext<AdminStateModel>, { }: OnClearDepartment): void {
    patchState({ department: null });
  };

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
}
