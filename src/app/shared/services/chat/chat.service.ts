import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Role } from '../../enum/role';
import { ChatRoom, IncomingMessage, MessagesParameters } from '../../models/chat.model';
import { PaginationElement } from '../../models/paginationElement.model';
import { PaginatorState } from '../../store/paginator.state';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient, private store: Store) {}

  //TODO: After fixing the data model on Search Response, change the return type to Observable<SearchResponse<ChatRoom[]>>
  getChatRooms(role: Role): Observable<ChatRoom[]> {
    let params = this.setFilterParams();

    return this.http.get<ChatRoom[]>(`/api/v1/ChatWorkshop/${role}/chatrooms`, { params });
  }

  //TODO: reduce the number of arguments
  getChatRoomsMessages(chatRoomId: string, role: Role, parameters: MessagesParameters): Observable<IncomingMessage[]> {
    let params = new HttpParams().set('Size', parameters.size.toString()).set('From', parameters.from.toString());

    return this.http.get<IncomingMessage[]>(`/api/v1/ChatWorkshop/${role}/chatrooms/${chatRoomId}/messages`, { params });
  }

  getChatRoomById(chatRoomId: string, role: Role) {
    return this.http.get<ChatRoom>(`/api/v1/ChatWorkshop/${role}/chatrooms/${chatRoomId}`);
  }

  private setFilterParams(): HttpParams {
    //TODO: Uncomment after fixing the search query with the size parameter.
    // const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    // const size = this.store.selectSnapshot(PaginatorState.chatRoomsPerPage);
    // const from = size * (+currentPage.element - 1);
    // let params = new HttpParams().set('Size', size.toString()).set('From', from.toString());
    let params = new HttpParams();

    return params;
  }
}
