import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../enum/role';
import { ChatRoom } from '../../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChatRooms(role: Role): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>('assets/mocks/chatrooms.json');
    //TODO: return this.http.get<ChatRoom[]>(`/api/v1/ChatWorkshop/${role}/chatrooms`);
  }
}
