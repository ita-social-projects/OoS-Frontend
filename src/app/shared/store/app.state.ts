import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Teacher } from '../models/teacher.model';
import { Workshop } from '../models/workshop.model';
import { TeacherService } from '../services/teachers/teacher.service';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import { ActivateEditMode, ChangePage, GetTeachersById, GetWorkshops, MarkFormDirty, SetLocation, ToggleLoading } from './app.actions';

export interface AppStateModel {
  isLoading: boolean;
  isMainPage: boolean;
  city: String;
  lng: Number | null;
  lat: Number | null;
  allWorkshops: Workshop[];
  teachers: Teacher[],
  isDirtyForm: boolean,
  isEditMode: boolean
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isLoading: false,
    isMainPage: true,
    city: "",
    lng: null,
    lat: null,
    allWorkshops: [],
    teachers: [],
    isDirtyForm: false,
    isEditMode: false
  }
})
@Injectable()
export class AppState {
  @Selector()
  static isMainPage(state: AppStateModel): boolean { return state.isMainPage }

  @Selector()
  static isLoading(state: AppStateModel): boolean { return state.isLoading }

  @Selector()
  static allWorkshops(state: AppStateModel): Workshop[] { return state.allWorkshops }

  @Selector()
  static teachers(state: AppStateModel): Teacher[] { return state.teachers }

  @Selector()
  static isDirtyForm(state: AppStateModel): boolean { return state.isDirtyForm }

  @Selector()
  static isEditMode(state: AppStateModel): boolean { return state.isEditMode }

  constructor(
    private appWorkshopsService: AppWorkshopsService,
    private teacherService: TeacherService
  ) { }

  @Action(ToggleLoading)
  toggleLoading({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
    patchState({ isLoading: payload });
  }

  @Action(ChangePage)
  changePage({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
    patchState({ isMainPage: payload });
  }

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<AppStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat });
  }

  @Action(GetWorkshops)
  getWorkshops({ patchState }: StateContext<AppStateModel>, { }: GetWorkshops) {
    return this.appWorkshopsService
      .getAllWorkshops()
      .subscribe((workshops: Workshop[]) => patchState({ allWorkshops: workshops }))
  }

  @Action(GetTeachersById)
  getChildrenById({ patchState }: StateContext<AppStateModel>, { payload }: GetTeachersById) {
    return this.teacherService
      .getTeachersById(payload)
      .pipe(
        tap((workshopTeachers: Teacher[]) => patchState({ teachers: workshopTeachers })
        ))
  }

  @Action(MarkFormDirty)
  markFormDirty({ patchState }: StateContext<AppStateModel>, { payload }: MarkFormDirty): void {
    patchState({ isDirtyForm: payload });
  }

  @Action(ActivateEditMode)
  activateEditMode({ patchState }: StateContext<AppStateModel>, { payload }: ActivateEditMode): void {
    patchState({ isEditMode: payload });
  }
}
