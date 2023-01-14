import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { EMPTY_RESULT } from '../constants/constants';
import { ChatRoom, IncomingMessage } from '../models/chat.model';
import { SearchResponse } from '../models/search.model';
import { ChatService } from '../services/chat/chat.service';
import {
  ClearSelectedChatRoom,
  GetChatRoomById,
  GetChatRoomMessages,
  GetChatRoomMessagesByWorkshopId,
  GetUserChatRooms
} from './chat.actions';

export interface ChatStateModel {
  isLoadingData: boolean;
  chatRooms: SearchResponse<ChatRoom[]>;
  selectedChatRoom: ChatRoom;
  selectedChatRoomMessages: IncomingMessage[];
}

@State<ChatStateModel>({
  name: 'chat',
  defaults: {
    isLoadingData: false,
    chatRooms: null,
    selectedChatRoom: null,
    selectedChatRoomMessages: null
  }
})
@Injectable()
export class ChatState {
  @Selector()
  static isLoadingData(state: ChatStateModel): boolean {
    return state.isLoadingData;
  }

  @Selector()
  static chatRooms(state: ChatStateModel): SearchResponse<ChatRoom[]> {
    return state.chatRooms;
  }

  @Selector()
  static selectedChatRoom(state: ChatStateModel): ChatRoom {
    return state.selectedChatRoom;
  }

  @Selector()
  static selectedChatRoomMessages(state: ChatStateModel): IncomingMessage[] {
    return state.selectedChatRoomMessages;
  }

  constructor(private chatService: ChatService) {}

  @Action(GetUserChatRooms)
  getUserChatRooms({ patchState }: StateContext<ChatStateModel>, { parameters }: GetUserChatRooms): Observable<SearchResponse<ChatRoom[]>> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRooms(parameters)
      .pipe(tap((chatRooms: SearchResponse<ChatRoom[]>) => patchState({ chatRooms: chatRooms ?? EMPTY_RESULT, isLoadingData: false })));
  }

  @Action(GetChatRoomMessages)
  getChatRoomMessages(
    { patchState }: StateContext<ChatStateModel>,
    { chatRoomId, role, parameters }: GetChatRoomMessages
  ): Observable<IncomingMessage[]> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRoomsMessages(chatRoomId, role, parameters)
      .pipe(tap((selectedChatRoomMessages: IncomingMessage[]) => patchState({ selectedChatRoomMessages, isLoadingData: false })));
  }

  @Action(GetChatRoomMessagesByWorkshopId)
  getChatRoomMessagesByWorkshopId(
    { patchState }: StateContext<ChatStateModel>,
    { workshopId, parameters }: GetChatRoomMessagesByWorkshopId
  ): Observable<IncomingMessage[]> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRoomMessagesByWorkshopId(workshopId, parameters)
      .pipe(tap((selectedChatRoomMessages: IncomingMessage[]) => patchState({ selectedChatRoomMessages, isLoadingData: false })));
  }

  @Action(GetChatRoomById)
  getChatRoom({ patchState }: StateContext<ChatStateModel>, { chatRoomId, role }: GetChatRoomById): Observable<ChatRoom> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRoomById(chatRoomId, role)
      .pipe(tap((selectedChatRoom: ChatRoom) => patchState({ selectedChatRoom, isLoadingData: false })));
  }

  @Action(ClearSelectedChatRoom)
  clearSelectedChatRoom({ patchState }: StateContext<ChatStateModel>): void {
    patchState({ selectedChatRoom: null, selectedChatRoomMessages: null });
  }
}
