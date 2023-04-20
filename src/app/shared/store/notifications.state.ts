import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { SnackbarText } from '../enum/enumUA/messageBer';
import {
  Notification, NotificationGroupedByAdditionalData, Notifications, NotificationsAmount,
  NotificationsGroupedByType
} from '../models/notifications.model';
import { NotificationsService } from '../services/notifications/notifications.service';
import { ShowMessageBar } from './app.actions';
import {
  ClearNotificationState, DeleteUsersNotificationById, GetAllUsersNotificationsGrouped,
  GetAmountOfNewUsersNotifications, OnDeleteUsersNotificationByIdFail,
  OnDeleteUsersNotificationByIdSuccess, OnReadUsersNotificationsByTypeSuccess,
  OnReadUsersNotificationsFail, ReadUsersNotificationById, ReadUsersNotificationsByType
} from './notifications.actions';

export interface NotificationsStateModel {
  notificationsAmount: NotificationsAmount;
  notifications: Notifications;
}
@State<NotificationsStateModel>({
  name: 'notifications',
  defaults: {
    notificationsAmount: undefined,
    notifications: undefined
  }
})
@Injectable()
export class NotificationsState {
  @Selector()
  static notificationsAmount(state: NotificationsStateModel): NotificationsAmount {
    return state.notificationsAmount;
  }
  @Selector()
  static notifications(state: NotificationsStateModel): Notifications {
    return state.notifications;
  }

  constructor(private notificationsService: NotificationsService) {}

  @Action(GetAmountOfNewUsersNotifications)
  getAmountOfNewUsersNotifications(
    { patchState }: StateContext<NotificationsStateModel>,
    {}: GetAmountOfNewUsersNotifications
  ): Observable<NotificationsAmount> {
    return this.notificationsService
      .getAmountOfNewUsersNotifications()
      .pipe(tap((notificationsAmount: NotificationsAmount) => patchState({ notificationsAmount })));
  }

  @Action(GetAllUsersNotificationsGrouped)
  getAllUsersNotificationsGrouped(
    { patchState }: StateContext<NotificationsStateModel>,
    {}: GetAmountOfNewUsersNotifications
  ): Observable<Notifications> {
    return this.notificationsService
      .getAllUsersNotificationsGrouped()
      .pipe(tap((notifications: Notifications) => patchState({ notifications })));
  }

  @Action(ReadUsersNotificationsByType)
  readUsersNotificationsByType(
    { dispatch }: StateContext<NotificationsStateModel>,
    { notificationType, needGetRequest }: ReadUsersNotificationsByType
  ): Observable<void | Observable<void>> {
    return this.notificationsService.readUsersNotificationsByType(notificationType).pipe(
      tap(() => {
        if (needGetRequest) {
          dispatch(new OnReadUsersNotificationsByTypeSuccess());
        }
      }),
      catchError((error: Error) => of(dispatch(new OnReadUsersNotificationsFail(error))))
    );
  }

  @Action(OnReadUsersNotificationsByTypeSuccess)
  onReadUsersNotificationsByTypeSuccess(
    { dispatch }: StateContext<NotificationsStateModel>,
    {}: OnReadUsersNotificationsByTypeSuccess
  ): void {
    dispatch([new GetAllUsersNotificationsGrouped(), new GetAmountOfNewUsersNotifications()]);
  }

  @Action(ReadUsersNotificationById)
  readUsersNotificationsById(
    { dispatch }: StateContext<NotificationsStateModel>,
    { payload }: ReadUsersNotificationById
  ): Observable<Notification | Observable<void>> {
    return this.notificationsService
      .readUsersNotificationById(payload)
      .pipe(catchError((error: Error) => of(dispatch(new OnReadUsersNotificationsFail(error)))));
  }

  @Action(DeleteUsersNotificationById)
  deleteUsersNotificationById(
    { dispatch }: StateContext<NotificationsStateModel>,
    { notificationId }: DeleteUsersNotificationById
  ): Observable<void | Observable<void>> {
    return this.notificationsService.deleteNotification(notificationId).pipe(
      tap(() => dispatch(new OnDeleteUsersNotificationByIdSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteUsersNotificationByIdFail(error))))
    );
  }

  @Action(OnDeleteUsersNotificationByIdSuccess)
  onDeleteUsersNotificationByIdSuccess({ dispatch }: StateContext<NotificationsStateModel>): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.deleteNotification, type: 'success' }));
  }

  @Action(OnDeleteUsersNotificationByIdFail)
  onDeleteUsersNotificationByIdFail(
    { dispatch }: StateContext<NotificationsStateModel>,
    { error }: OnDeleteUsersNotificationByIdFail
  ): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnReadUsersNotificationsFail)
  onReadUsersNotificationsFail({ dispatch }: StateContext<NotificationsStateModel>, { payload }: OnReadUsersNotificationsFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(ClearNotificationState)
  clearNotificationState({ patchState }: StateContext<NotificationsStateModel>): void {
    patchState({ notifications: null });
  }
}
