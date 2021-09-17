import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Teacher } from '../models/teacher.model';
import { WorkshopCard } from '../models/workshop.model';
import { TeacherService } from '../services/teachers/teacher.service';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import { ActivateEditMode, GetTeachersById, MarkFormDirty, SetLocation, ShowMessageBar, ToggleLoading, ToggleMobileScreen } from './app.actions';

export interface AppStateModel {
  isLoading: boolean;
  city: String;
  lng: Number | null;
  lat: Number | null;
  allWorkshops: WorkshopCard[];
  teachers: Teacher[],
  isDirtyForm: boolean,
  isEditMode: boolean,
  isMobileScreen: undefined | boolean
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isLoading: false,
    city: "",
    lng: null,
    lat: null,
    allWorkshops: [],
    teachers: [],
    isDirtyForm: false,
    isEditMode: false,
    isMobileScreen: undefined
  }
})
@Injectable()
export class AppState {

  @Selector()
  static isLoading(state: AppStateModel): boolean { return state.isLoading }

  @Selector()
  static isMobileScreen(state: AppStateModel): boolean { return state.isMobileScreen }

  @Selector()
  static allWorkshops(state: AppStateModel): WorkshopCard[] { return state.allWorkshops }

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

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<AppStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat });
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

  @Action(ShowMessageBar)
  showMessageBar({ }: StateContext<AppStateModel>, { payload }: ShowMessageBar): void {
  }

  @Action(ToggleMobileScreen)
  ToggleMobileScreen({patchState}:StateContext<AppStateModel>, { payload }: ActivateEditMode): void {
      patchState({ isMobileScreen: payload })
  }
}
