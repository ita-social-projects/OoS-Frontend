import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { Notification, NotificationAmount, NotificationGroupedAndSingle } from 'shared/models/notification.model';
import { NotificationService } from 'shared/services/notification/notification.service';
import { ShowMessageBar } from './app.actions';
import {
  ClearNotificationState,
  DeleteUsersNotificationById,
  GetAllUsersNotificationsGrouped,
  GetAmountOfNewUsersNotifications,
  OnDeleteUsersNotificationByIdFail,
  OnDeleteUsersNotificationByIdSuccess,
  OnReadUsersNotificationsByTypeSuccess,
  OnReadUsersNotificationsFail,
  ReadUsersNotificationById,
  ReadUsersNotificationsByType
} from './notification.actions';

export interface NotificationStateModel {
  notificationsAmount: NotificationAmount;
  notifications: NotificationGroupedAndSingle;
}

@State<NotificationStateModel>({
  name: 'notifications',
  defaults: {
    notificationsAmount: undefined,
    notifications: undefined
  }
})
@Injectable()
export class NotificationState {
  @Selector()
  static notificationsAmount(state: NotificationStateModel): NotificationAmount {
    return state.notificationsAmount;
  }

  @Selector()
  static notifications(state: NotificationStateModel): NotificationGroupedAndSingle {
    return state.notifications;
  }

  constructor(private notificationService: NotificationService) {}

  @Action(GetAmountOfNewUsersNotifications)
  getAmountOfNewUsersNotifications(
    { patchState }: StateContext<NotificationStateModel>,
    {}: GetAmountOfNewUsersNotifications
  ): Observable<NotificationAmount> {
    return this.notificationService
      .getAmountOfNewUsersNotifications()
      .pipe(tap((notificationsAmount: NotificationAmount) => patchState({ notificationsAmount })));
  }

  @Action(GetAllUsersNotificationsGrouped)
  getAllUsersNotificationsGrouped(
    { patchState }: StateContext<NotificationStateModel>,
    {}: GetAmountOfNewUsersNotifications
  ): Observable<NotificationGroupedAndSingle> {
    return this.notificationService
      .getAllUsersNotificationsGrouped()
      .pipe(tap((notifications: NotificationGroupedAndSingle) => patchState({ notifications })));
  }

  @Action(ReadUsersNotificationsByType)
  readUsersNotificationsByType(
    { dispatch }: StateContext<NotificationStateModel>,
    { notificationType, needGetRequest }: ReadUsersNotificationsByType
  ): Observable<void> {
    return this.notificationService.readUsersNotificationsByType(notificationType).pipe(
      tap(() => {
        if (needGetRequest) {
          dispatch(new OnReadUsersNotificationsByTypeSuccess());
        }
      }),
      catchError((error: Error) => dispatch(new OnReadUsersNotificationsFail(error)))
    );
  }

  @Action(OnReadUsersNotificationsByTypeSuccess)
  onReadUsersNotificationsByTypeSuccess(
    { dispatch }: StateContext<NotificationStateModel>,
    {}: OnReadUsersNotificationsByTypeSuccess
  ): void {
    dispatch([new GetAllUsersNotificationsGrouped(), new GetAmountOfNewUsersNotifications()]);
  }

  @Action(ReadUsersNotificationById)
  readUsersNotificationsById(
    { dispatch }: StateContext<NotificationStateModel>,
    { payload }: ReadUsersNotificationById
  ): Observable<Notification | void> {
    return this.notificationService
      .readUsersNotificationById(payload)
      .pipe(catchError((error: Error) => dispatch(new OnReadUsersNotificationsFail(error))));
  }

  @Action(DeleteUsersNotificationById)
  deleteUsersNotificationById(
    { dispatch }: StateContext<NotificationStateModel>,
    { notificationId }: DeleteUsersNotificationById
  ): Observable<void> {
    return this.notificationService.deleteNotification(notificationId).pipe(
      tap(() => dispatch(new OnDeleteUsersNotificationByIdSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnDeleteUsersNotificationByIdFail(error)))
    );
  }

  @Action(OnDeleteUsersNotificationByIdSuccess)
  onDeleteUsersNotificationByIdSuccess({ dispatch }: StateContext<NotificationStateModel>): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.deleteNotification, type: 'success' }));
  }

  @Action(OnDeleteUsersNotificationByIdFail)
  onDeleteUsersNotificationByIdFail(
    { dispatch }: StateContext<NotificationStateModel>,
    { error }: OnDeleteUsersNotificationByIdFail
  ): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnReadUsersNotificationsFail)
  onReadUsersNotificationsFail({ dispatch }: StateContext<NotificationStateModel>, { payload }: OnReadUsersNotificationsFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(ClearNotificationState)
  clearNotificationState({ patchState }: StateContext<NotificationStateModel>): void {
    patchState({ notifications: null });
  }
}