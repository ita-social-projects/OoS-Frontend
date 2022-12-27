import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Role } from '../../enum/role';
import { ChatRoom, ChatRoomsParameters, IncomingMessage, MessagesParameters } from '../../models/chat.model';
import { PaginationElement } from '../../models/paginationElement.model';
import { PaginatorState } from '../../store/paginator.state';
import { RegistrationState } from '../../store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient, private store: Store) {}

  //TODO: After fixing the data model on Search Response, change the return type to Observable<SearchResponse<ChatRoom[]>>
  getChatRooms(parameters: ChatRoomsParameters): Observable<ChatRoom[]> {
    const role = this.store.selectSnapshot(RegistrationState.role);
    let params = this.setFilterParams(parameters);

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

  private setFilterParams(parameters: ChatRoomsParameters): HttpParams {
    //TODO: Uncomment after fixing the search query with the size parameter.
    // const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    // const size = this.store.selectSnapshot(PaginatorState.chatRoomsPerPage);
    // const from = size * (+currentPage.element - 1);
    // let params = new HttpParams().set('Size', size.toString()).set('From', from.toString());
    let params = new HttpParams();

    if (parameters.searchText) {
      params = params.set('SearchText', parameters.searchText);
    }

    return params;
  }
}
