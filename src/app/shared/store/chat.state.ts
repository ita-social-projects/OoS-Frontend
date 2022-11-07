import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { ChatRoom, Message } from '../models/chat.model';
import { ChatService } from '../services/chat/chat.service';
import {
  GetChatRoomById,
  GetChatRoomMessages,
  GetUserChatRooms
} from './chat.actions';

export interface ChatStateModel {
  isLoadingData: boolean;
  chatRooms: ChatRoom[];
  selectedChatRoom: ChatRoom;
  selectedChatRoomMessages: Message[];
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
  static chatRooms(state: ChatStateModel): ChatRoom[] {
    return state.chatRooms;
  }

  @Selector()
  static selectedChatRoom(state: ChatStateModel): ChatRoom {
    return state.selectedChatRoom;
  }

  @Selector()
  static selectedChatRoomMessages(state: ChatStateModel): Message[] {
    return state.selectedChatRoomMessages;
  }

  constructor(private chatService: ChatService) {}

  @Action(GetUserChatRooms)
  getUserChatRooms({ patchState }: StateContext<ChatStateModel>, { userRole }: GetUserChatRooms): Observable<ChatRoom[]> {
    patchState({ isLoadingData: true });
    return this.chatService.getChatRooms(userRole).pipe(tap((chatRooms: ChatRoom[]) => patchState({ chatRooms, isLoadingData: false })));
  }

  @Action(GetChatRoomMessages)
  getChatRoomMessages(
    { patchState }: StateContext<ChatStateModel>,
    { chatRoomId, parameters }: GetChatRoomMessages
  ): Observable<Message[]> {
    patchState({ isLoadingData: true });
    return this.chatService.getChatRoomsMessages(chatRoomId, parameters).pipe(
      tap((messages: Message[]) =>
        patchState({
          selectedChatRoomMessages: messages,
          isLoadingData: false
        })
      )
    );
  }

  @Action(GetChatRoomById)
  getChatRoom(
    { patchState }: StateContext<ChatStateModel>,
    { chatRoomId }: GetChatRoomById
  ): Observable<ChatRoom> {
    patchState({ isLoadingData: true });
    return this.chatService.getChatRoomById(chatRoomId).pipe(
      tap((chatRoom: ChatRoom) =>
        patchState({
          selectedChatRoom: chatRoom,
          isLoadingData: false
        })
      )
    );
  }
}
