import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Role } from '../../enum/role';
import { ChatRoom, ChatRoomsParameters, IncomingMessage, MessagesParameters } from '../../models/chat.model';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChatRooms(parameters: ChatRoomsParameters): Observable<SearchResponse<ChatRoom[]>> {
    const params = this.setChatRoomParams(parameters);

    return this.http.get<SearchResponse<ChatRoom[]>>(`/api/v1/ChatWorkshop/${parameters.role}/chatrooms`, { params });
  }

  getChatRoomsForProviderByParentId(parentId: string): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`/api/v1/ChatWorkshop/provider/chatroomsforparent/${parentId}`);
  }

  getChatRoomById(role: Role, chatRoomId: string): Observable<ChatRoom> {
    return this.http.get<ChatRoom>(`/api/v1/ChatWorkshop/${role}/chatrooms/${chatRoomId}`);
  }

  getChatRoomForParentByWorkshopId(workshopId: string): Observable<ChatRoom> {
    return this.http.get<ChatRoom>(`/api/v1/ChatWorkshop/parent/chatroomforworkshop/${workshopId}`);
  }

  getChatRoomMessagesById(role: Role, chatRoomId: string, parameters: MessagesParameters): Observable<IncomingMessage[]> {
    const params = this.setMessagesParams(parameters);

    return this.http.get<IncomingMessage[]>(`/api/v1/ChatWorkshop/${role}/chatrooms/${chatRoomId}/messages`, { params });
  }

  getChatRoomMessagesForParentByWorkshopId(workshopId: string, parameters: MessagesParameters): Observable<IncomingMessage[]> {
    const params = this.setMessagesParams(parameters);

    return this.http.get<IncomingMessage[]>(`/api/v1/ChatWorkshop/parent/workshops/${workshopId}/messages`, { params });
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
}
