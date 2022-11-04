import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../../../../environments/environment';
import { GetAmountOfNewUsersNotifications } from '../../store/notifications.actions';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private url = environment.serverUrl + '/notificationhub';
  private token = null;

  constructor(public store: Store, private oidcSecurityService: OidcSecurityService) {}

  startConnection(): void {
    this.oidcSecurityService.getAccessToken().subscribe((value: string) => (this.token = value));
    const options: signalR.IHttpConnectionOptions = {
      accessTokenFactory: () => this.token
    };

    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.url, options)
      .build();

    this.hubConnection.start().catch((err) => console.error('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      this.store.dispatch(new GetAmountOfNewUsersNotifications());
    });
  }
}
