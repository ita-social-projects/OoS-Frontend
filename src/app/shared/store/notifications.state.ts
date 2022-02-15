import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { NotificationsAmount } from "../models/notifications.model";
import { NotificationsService } from "../services/notifications/notifications.service";
import { GetAmountOfNewUsersNotifications } from "./notifications.actions";

export interface NotificationsStateModel {
  notificationsAmount: NotificationsAmount;
}
@State<NotificationsStateModel>({
  name: 'notifications',
  defaults: {
    notificationsAmount: null,
  }
})

@Injectable()
export class NotificationsState {
  @Selector()
  static notificationsAmount(state: NotificationsStateModel): NotificationsAmount | null {
    return state.notificationsAmount;
  }

  constructor(
    private notificationsService: NotificationsService,
  ) { }

  @Action(GetAmountOfNewUsersNotifications)
  getAmountOfNewUsersNotifications({ patchState }: StateContext<NotificationsStateModel>, { }: GetAmountOfNewUsersNotifications): void {
    debugger;
    this.notificationsService.getAmountOfNewUsersNotifications().pipe(
      tap((notificationsAmount: any) => {
        console.log(notificationsAmount)
        patchState({ notificationsAmount: notificationsAmount })
      }
      ));
  }
}