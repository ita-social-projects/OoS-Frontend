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
  OnReadAllUsersNotificationsFail,
  OnReadUsersNotificationsByTypeFail,
  OnReadUsersNotificationsByTypeSuccess,
  ReadAllUsersNotifications,
  ReadUsersNotificationById,
  ReadUsersNotificationsByType
} from './notification.actions';

export interface NotificationStateModel {
  notificationAmount: NotificationAmount;
  notifications: NotificationGroupedAndSingle;
}

@State<NotificationStateModel>({
  name: 'notifications',
  defaults: {
    notificationAmount: undefined,
    notifications: undefined
  }
})
@Injectable()
export class NotificationState {
  constructor(private notificationService: NotificationService) {}

  @Selector()
  static notificationAmount(state: NotificationStateModel): NotificationAmount {
    return state.notificationAmount;
  }

  @Selector()
  static notifications(state: NotificationStateModel): NotificationGroupedAndSingle {
    return state.notifications;
  }

  @Action(ClearNotificationState)
  clearNotificationState({ patchState }: StateContext<NotificationStateModel>): void {
    patchState({ notifications: null });
  }

  @Action(GetAmountOfNewUsersNotifications)
  getAmountOfNewUsersNotifications({ patchState }: StateContext<NotificationStateModel>): Observable<NotificationAmount> {
    return this.notificationService
      .getAmountOfNewUsersNotifications()
      .pipe(tap((notificationAmount: NotificationAmount) => patchState({ notificationAmount })));
  }

  @Action(GetAllUsersNotificationsGrouped)
  getAllUsersNotificationsGrouped({ patchState }: StateContext<NotificationStateModel>): Observable<NotificationGroupedAndSingle> {
    return this.notificationService
      .getAllUsersNotificationsGrouped()
      .pipe(tap((notifications: NotificationGroupedAndSingle) => patchState({ notifications })));
  }

  @Action(ReadAllUsersNotifications)
  readAllUsersNotifications({ dispatch }: StateContext<NotificationStateModel>): Observable<void> {
    return this.notificationService
      .readAllUsersNotifications()
      .pipe(catchError((error: Error) => dispatch(new OnReadAllUsersNotificationsFail(error))));
  }

  @Action(OnReadAllUsersNotificationsFail)
  onReadAllUsersNotificationsFail({ dispatch }: StateContext<NotificationStateModel>, { error }: OnDeleteUsersNotificationByIdFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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
      catchError((error: Error) => dispatch(new OnReadUsersNotificationsByTypeFail(error)))
    );
  }

  @Action(OnReadUsersNotificationsByTypeSuccess)
  onReadUsersNotificationsByTypeSuccess({ dispatch }: StateContext<NotificationStateModel>): void {
    dispatch([new GetAllUsersNotificationsGrouped(), new GetAmountOfNewUsersNotifications()]);
  }

  @Action(OnReadUsersNotificationsByTypeFail)
  onReadUsersNotificationsByTypeFail(
    { dispatch }: StateContext<NotificationStateModel>,
    { payload }: OnReadUsersNotificationsByTypeFail
  ): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(ReadUsersNotificationById)
  readUsersNotificationsById(
    { dispatch }: StateContext<NotificationStateModel>,
    { payload }: ReadUsersNotificationById
  ): Observable<Notification | void> {
    return this.notificationService
      .readUsersNotificationById(payload)
      .pipe(catchError((error: Error) => dispatch(new OnReadUsersNotificationsByTypeFail(error))));
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
}
