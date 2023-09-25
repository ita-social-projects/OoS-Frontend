import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, tap } from 'rxjs';

import { EMPTY_RESULT } from '../constants/constants';
import { ChatRoom, IncomingMessage } from '../models/chat.model';
import { SearchResponse } from '../models/search.model';
import { ChatService } from '../services/chat/chat.service';
import {
  ClearSelectedChatRoom,
  GetChatRoomByApplicationId,
  GetChatRoomById,
  GetChatRoomForParentByWorkshopId,
  GetChatRoomMessagesById,
  GetChatRoomMessagesForParentByWorkshopId,
  GetChatRooms
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

  @Action(GetChatRooms)
  getChatRooms({ patchState }: StateContext<ChatStateModel>, { parameters }: GetChatRooms): Observable<SearchResponse<ChatRoom[]>> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRooms(parameters)
      .pipe(tap((chatRooms) => patchState({ isLoadingData: false, chatRooms: chatRooms ?? EMPTY_RESULT })));
  }

  @Action(GetChatRoomById)
  getChatRoomById({ patchState }: StateContext<ChatStateModel>, { role, chatRoomId }: GetChatRoomById): Observable<ChatRoom> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRoomById(role, chatRoomId)
      .pipe(tap((selectedChatRoom) => patchState({ isLoadingData: false, selectedChatRoom })));
  }

  @Action(GetChatRoomForParentByWorkshopId)
  getChatRoomForParentByWorkshopId(
    { patchState }: StateContext<ChatStateModel>,
    { workshopId }: GetChatRoomForParentByWorkshopId
  ): Observable<ChatRoom> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRoomForParentByWorkshopId(workshopId)
      .pipe(tap((selectedChatRoom) => patchState({ isLoadingData: false, selectedChatRoom })));
  }

  @Action(GetChatRoomByApplicationId)
  getChatRoomByApplicationId(
    { patchState }: StateContext<ChatStateModel>,
    { applicationId }: GetChatRoomByApplicationId
  ): Observable<ChatRoom> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRoomByApplicationId(applicationId)
      .pipe(tap((selectedChatRoom) => patchState({ isLoadingData: false, selectedChatRoom })));
  }

  @Action(GetChatRoomMessagesById)
  getChatRoomMessagesById(
    { patchState }: StateContext<ChatStateModel>,
    { role, chatRoomId, parameters }: GetChatRoomMessagesById
  ): Observable<IncomingMessage[]> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRoomMessagesById(role, chatRoomId, parameters)
      .pipe(tap((selectedChatRoomMessages) => patchState({ isLoadingData: false, selectedChatRoomMessages })));
  }

  @Action(GetChatRoomMessagesForParentByWorkshopId)
  getChatRoomMessagesForParentByWorkshopId(
    { patchState }: StateContext<ChatStateModel>,
    { workshopId, parameters }: GetChatRoomMessagesForParentByWorkshopId
  ): Observable<IncomingMessage[]> {
    patchState({ isLoadingData: true });
    return this.chatService
      .getChatRoomMessagesForParentByWorkshopId(workshopId, parameters)
      .pipe(tap((selectedChatRoomMessages) => patchState({ isLoadingData: false, selectedChatRoomMessages })));
  }

  @Action(ClearSelectedChatRoom)
  clearSelectedChatRoom({ patchState }: StateContext<ChatStateModel>): void {
    patchState({ selectedChatRoom: null, selectedChatRoomMessages: null });
  }
}
