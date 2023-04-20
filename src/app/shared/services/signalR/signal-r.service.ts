import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private token = null;

  constructor(public store: Store, private oidcSecurityService: OidcSecurityService) {}

  startConnection(hubUrl: string): signalR.HubConnection {
    const url = environment.serverUrl + hubUrl;
    let hubConnection: signalR.HubConnection;

    this.oidcSecurityService.getAccessToken().subscribe((value: string) => (this.token = value));
    const options: signalR.IHttpConnectionOptions = {
      accessTokenFactory: () => this.token
    };

    hubConnection = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.Information).withUrl(url, options).build();

    hubConnection.start().catch((err) => console.error('Error while starting connection: ' + err));

    return hubConnection;
  }
}
