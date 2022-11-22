import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SnackbarText } from '../enum/messageBar';
import { NotificationType } from '../enum/notifications';
import { Notification, Notifications, NotificationsAmount } from '../models/notifications.model';
import { NotificationsService } from '../services/notifications/notifications.service';
import { ShowMessageBar } from './app.actions';
import {
  GetAllUsersNotificationsGrouped,
  GetAmountOfNewUsersNotifications,
  OnReadUsersNotificationsFail,
  OnReadUsersNotificationsByTypeSuccess,
  ReadUsersNotificationsByType,
  ReadUsersNotificationById,
  OnReadUsersNotificationByIdSuccess,
  DeleteUsersNotificationById,
  OnDeleteUsersNotificationByIdSuccess,
  OnDeleteUsersNotificationByIdFail
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
      .pipe(tap((notificationsAmount: NotificationsAmount) => patchState({ notificationsAmount: notificationsAmount })));
  }

  @Action(GetAllUsersNotificationsGrouped)
  getAllUsersNotificationsGrouped(
    { patchState }: StateContext<NotificationsStateModel>,
    {}: GetAmountOfNewUsersNotifications
  ): Observable<Notifications> {
    return this.notificationsService
      .getAllUsersNotificationsGrouped()
      .pipe(tap((notifications: Notifications) => patchState({ notifications: notifications })));
  }

  @Action(ReadUsersNotificationsByType)
  readUsersNotificationsByType(
    { dispatch }: StateContext<NotificationsStateModel>,
    { payload }: ReadUsersNotificationsByType
  ): Observable<void | Observable<void>> {
    return this.notificationsService
      .readUsersNotificationsByType(payload)
      .pipe(catchError((error: Error) => of(dispatch(new OnReadUsersNotificationsFail(error)))));
  }

  @Action(OnReadUsersNotificationsByTypeSuccess)
  onReadUsersNotificationsByTypeSuccess(
    { dispatch }: StateContext<NotificationsStateModel>,
    {}: OnReadUsersNotificationsByTypeSuccess
  ): void {
    dispatch(new GetAmountOfNewUsersNotifications());
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
    //TODO: Snackbar
    dispatch(new ShowMessageBar({ message: SnackbarText.deleteAchievement, type: 'success' }));
  }

  @Action(OnDeleteUsersNotificationByIdFail)
  onDeleteUsersNotificationByIdFail(
    { dispatch }: StateContext<NotificationsStateModel>,
    { error }: OnDeleteUsersNotificationByIdFail
  ): void {
    throwError(() => error);
    //TODO: Snackbar
    dispatch(new ShowMessageBar({ message: SnackbarText.deleteAchievement, type: 'error' }));
  }

  @Action(OnReadUsersNotificationByIdSuccess)
  onReadUsersNotificationByIdSuccess({ dispatch }: StateContext<NotificationsStateModel>, {}: OnReadUsersNotificationByIdSuccess): void {
    dispatch(new GetAmountOfNewUsersNotifications());
    dispatch(new GetAllUsersNotificationsGrouped());
  }

  @Action(OnReadUsersNotificationsFail)
  onReadUsersNotificationsFail({ dispatch }: StateContext<NotificationsStateModel>, { payload }: OnReadUsersNotificationsFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }
}
