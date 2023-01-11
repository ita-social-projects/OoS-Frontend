import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Role } from '../../enum/role';
import { ChatRoom, ChatRoomsParameters, IncomingMessage, MessagesParameters } from '../../models/chat.model';
import { PaginationElement } from '../../models/paginationElement.model';
import { SearchResponse } from '../../models/search.model';
import { PaginatorState } from '../../store/paginator.state';
import { RegistrationState } from '../../store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient, private store: Store) {}

  getChatRooms(parameters: ChatRoomsParameters): Observable<SearchResponse<ChatRoom[]>> {
    const role = this.store.selectSnapshot(RegistrationState.role);
    let params = this.setFilterParams(parameters);

    return this.http.get<SearchResponse<ChatRoom[]>>(`/api/v1/ChatWorkshop/${role}/chatrooms`, { params });
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
    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size = this.store.selectSnapshot(PaginatorState.chatRoomsPerPage);
    const from = size * (+currentPage.element - 1);
    let params = new HttpParams().set('Size', size.toString()).set('From', from.toString());

    if (parameters.searchText) {
      params = params.set('SearchText', parameters.searchText);
    }

    if (parameters.workshopIds) {
      parameters.workshopIds.forEach((Id: string) => (params = params.append('WorkshopIds', Id)));
    }

    return params;
  }
}
