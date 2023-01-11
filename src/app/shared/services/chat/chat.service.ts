import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../enum/role';
import { ChatRoom, IncomingMessage, MessagesParameters } from '../../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChatRooms(role: Role): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`/api/v1/ChatWorkshop/${role}/chatrooms`);
  }

  //TODO: reduce the number of arguments
  getChatRoomsMessages(chatRoomId: string, role: Role, parameters: MessagesParameters): Observable<IncomingMessage[]> {
    let params = new HttpParams().set('Size', parameters.size.toString()).set('From', parameters.from.toString());

    return this.http.get<IncomingMessage[]>(`/api/v1/ChatWorkshop/${role}/chatrooms/${chatRoomId}/messages`, { params });
  }

  getChatRoomMessagesByWorkshopId(workshopId: string, parameters: MessagesParameters): Observable<IncomingMessage[]> {
    let params = new HttpParams().set('Size', parameters.size.toString()).set('From', parameters.from.toString());

    return this.http.get<IncomingMessage[]>(`/api/v1/ChatWorkshop/parent/workshops/${workshopId}/messages`, { params });
  }

  getChatRoomById(chatRoomId: string, role: Role) {
    return this.http.get<ChatRoom>(`/api/v1/ChatWorkshop/${role}/chatrooms/${chatRoomId}`);
  }
}
