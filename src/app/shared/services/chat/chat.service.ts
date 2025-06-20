import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

import { Role } from 'shared/enum/role';
import { ChatRoom, ChatRoomsParameters, IncomingMessage, MessagesParameters } from 'shared/models/chat.model';
import { SearchResponse } from 'shared/models/search.model';
import { Store } from '@ngxs/store';
import { MetaDataState } from 'shared/store/meta-data.state';
import { FeaturesList } from 'shared/models/features-list.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly baseApiUrl = '/api/v1/ChatWorkshop';

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  public getChatRooms(parameters: ChatRoomsParameters): Observable<SearchResponse<ChatRoom[]>> {
    const params = this.setChatRoomParams(parameters);

    return this.canRequest(this.http.get<SearchResponse<ChatRoom[]>>(`${this.baseApiUrl}/${parameters.role}/chatrooms`, { params }));
  }

  public getChatRoomById(role: Role, chatRoomId: string): Observable<ChatRoom> {
    return this.canRequest(this.http.get<ChatRoom>(`${this.baseApiUrl}/${role}/chatrooms/${chatRoomId}`));
  }

  public getChatRoomForParentByWorkshopId(workshopId: string): Observable<ChatRoom> {
    return this.canRequest(this.http.get<ChatRoom>(`${this.baseApiUrl}/parent/chatrooms/workshop/${workshopId}`));
  }

  public getChatRoomByApplicationId(applicationId: string): Observable<ChatRoom> {
    return this.canRequest(this.http.get<ChatRoom>(`${this.baseApiUrl}/chatrooms/applications/${applicationId}`));
  }

  public getChatRoomMessagesById(role: Role, chatRoomId: string, parameters: MessagesParameters): Observable<IncomingMessage[]> {
    const params = this.setMessagesParams(parameters);

    return this.canRequest(this.http.get<IncomingMessage[]>(`${this.baseApiUrl}/${role}/chatrooms/${chatRoomId}/messages`, { params }));
  }

  public getChatRoomMessagesForParentByWorkshopId(workshopId: string, parameters: MessagesParameters): Observable<IncomingMessage[]> {
    const params = this.setMessagesParams(parameters);

    return this.canRequest(this.http.get<IncomingMessage[]>(`${this.baseApiUrl}/parent/workshops/${workshopId}/messages`, { params }));
  }

  public getUnreadMessagesCount(): Observable<number> {
    return this.canRequest(this.http.get<number>(`${this.baseApiUrl}/user/unreadMessagesCount`));
  }

  private setChatRoomParams(parameters: ChatRoomsParameters): HttpParams {
    let params = new HttpParams().set('Size', parameters.size.toString()).set('From', parameters.from.toString());

    if (parameters.searchText) {
      params = params.set('SearchText', parameters.searchText);
    }
    if (parameters.workshopIds) {
      parameters.workshopIds.forEach((id: string) => (params = params.append('WorkshopIds', id)));
    }

    return params;
  }

  private setMessagesParams(parameters: MessagesParameters): HttpParams {
    return new HttpParams().set('Size', parameters.size.toString()).set('From', parameters.from.toString());
  }

  private canRequest<T>(obs$: Observable<T>): Observable<T> {
    const isMessagingFeature = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).messagingFeature;
    return isMessagingFeature ? obs$ : EMPTY;
  }
}
