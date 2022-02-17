import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { NotificationType } from "../enum/notifications";
import { Notifications, NotificationsAmount } from "../models/notifications.model";
import { NotificationsService } from "../services/notifications/notifications.service";
import { ShowMessageBar } from "./app.actions";
import { GetAllUsersNotificationsGrouped, GetAmountOfNewUsersNotifications, OnReadUsersNotificationsFail, OnReadUsersNotificationsByTypeSuccess, ReadUsersNotificationsByType, ReadUsersNotificationById, OnReadUsersNotificationByIdSuccess } from "./notifications.actions";

export interface NotificationsStateModel {
  isLoading: boolean;
  notificationsAmount: NotificationsAmount;
  notifications: Notifications;
}
@State<NotificationsStateModel>({
  name: 'notifications',
  defaults: {
    isLoading: false,
    notificationsAmount: undefined,
    notifications: undefined,
  }
})

@Injectable()
export class NotificationsState {
  @Selector()
  static isLoading(state: NotificationsStateModel): boolean { return state.isLoading; }

  @Selector()
  static notificationsAmount(state: NotificationsStateModel): NotificationsAmount {
    return state.notificationsAmount;
  }
  @Selector()
  static notifications(state: NotificationsStateModel): Notifications {
    return state.notifications;
  }

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
  ) { }

  @Action(GetAmountOfNewUsersNotifications)
  getAmountOfNewUsersNotifications({ patchState }: StateContext<NotificationsStateModel>, { }: GetAmountOfNewUsersNotifications): Observable<NotificationsAmount> {
    patchState({ isLoading: true });
    return this.notificationsService.getAmountOfNewUsersNotifications().pipe(
      tap((notificationsAmount: NotificationsAmount) => patchState({ notificationsAmount: notificationsAmount, isLoading: false })));
  }

  @Action(GetAllUsersNotificationsGrouped)
  getAllUsersNotificationsGrouped({ patchState }: StateContext<NotificationsStateModel>, { }: GetAmountOfNewUsersNotifications): Observable<Notifications> {
    patchState({ isLoading: true });
    return this.notificationsService.getAllUsersNotificationsGrouped().pipe(
      tap((notifications: Notifications) => patchState({ notifications: notifications, isLoading: false })));
  }

  @Action(ReadUsersNotificationsByType)
  readUsersNotificationsByType({ patchState, dispatch }: StateContext<NotificationsStateModel>, { payload }: ReadUsersNotificationsByType): Observable<object> {
    patchState({ isLoading: true });
    return this.notificationsService
      .readUsersNotificationsByType(payload)
      .pipe(
        tap(() => dispatch(new OnReadUsersNotificationsByTypeSuccess(payload))),
        catchError((error: Error) => of(dispatch(new OnReadUsersNotificationsFail(error))))
      );
  }

  @Action(OnReadUsersNotificationsByTypeSuccess)
  onReadUsersNotificationsByTypeSuccess({ patchState, dispatch }: StateContext<NotificationsStateModel>, { payload }: OnReadUsersNotificationsByTypeSuccess): void {
    patchState({ isLoading: false });
    dispatch(new GetAmountOfNewUsersNotifications());
    this.router.navigate([`/personal-cabinet/${NotificationType[payload.type]}`]);
  }

  @Action(ReadUsersNotificationById)
  readUsersNotificationsById({ patchState, dispatch }: StateContext<NotificationsStateModel>, { payload }: ReadUsersNotificationById): Observable<object> {
    patchState({ isLoading: true });
    return this.notificationsService
      .readUsersNotificationById(payload)
      .pipe(
        tap(() => dispatch(new OnReadUsersNotificationByIdSuccess())),
        catchError((error: Error) => of(dispatch(new OnReadUsersNotificationsFail(error))))
      );
  }

  @Action(OnReadUsersNotificationByIdSuccess)
  onReadUsersNotificationByIdSuccess({ patchState, dispatch }: StateContext<NotificationsStateModel>, { }: OnReadUsersNotificationByIdSuccess): void {
    patchState({ isLoading: false });
    dispatch(new GetAmountOfNewUsersNotifications());
  }

  @Action(OnReadUsersNotificationsFail)
  onReadUsersNotificationsFail({ dispatch, patchState }: StateContext<NotificationsStateModel>, { payload }: OnReadUsersNotificationsFail): void {
    throwError(payload);
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }
}