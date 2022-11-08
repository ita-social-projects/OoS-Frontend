import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../enum/role';
import { ChatRoom, Message, MessagesParameters } from '../../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChatRooms(role: Role): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>('assets/mocks/chatrooms.json');
    //TODO: return this.http.get<ChatRoom[]>(`/api/v1/ChatWorkshop/${role}/chatrooms`);
  }

  //TODO: reduce the number of arguments
  getChatRoomsMessages(chatRoomId: string, role: Role, parameters: MessagesParameters): Observable<Message[]> {
    let params = new HttpParams();

    params = params.set('Size', parameters.size.toString());
    params = params.set('From', parameters.from.toString());

    return this.http.get<Message[]>(`/api/v1/ChatWorkshop/${role}/chatrooms/${chatRoomId}/messages`, { params });
  }

  getChatRoomById(chatRoomId: string) {
    return this.http.get<ChatRoom>('assets/mocks/chatRoom.json');
  }
}
