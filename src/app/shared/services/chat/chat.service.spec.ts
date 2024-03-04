import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { Role } from 'shared/enum/role';
import { ChatRoom, ChatRoomsParameters, IncomingMessage, MessagesParameters } from 'shared/models/chat.model';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  const baseApiUrl = '/api/v1/ChatWorkshop';
  let service: ChatService;
  let httpTestingController: HttpTestingController;
  const mockChatRooms: ChatRoom[] = [
    {
      id: 'chatId1',
      isBlockedByProvider: false,
      parent: undefined,
      parentId: undefined,
      workshop: undefined,
      workshopId: 'workshopId1'
    },
    {
      id: 'chatId2',
      isBlockedByProvider: false,
      parent: undefined,
      parentId: undefined,
      workshop: undefined,
      workshopId: 'workshopId2'
    }
  ];
  const mockIncomingMessages: IncomingMessage[] = [
    {
      id: 'incomingMessageId',
      chatRoomId: 'chatRoomId1',
      createdDateTime: undefined,
      senderRoleIsProvider: false,
      text: 'text'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(ChatService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get chat rooms', (done) => {
    const parameters: ChatRoomsParameters = {
      role: Role.parent,
      searchText: 'searchText',
      workshopIds: ['chatId1'],
      size: 15,
      from: 0
    };

    service.getChatRooms(parameters).subscribe((chatRooms) => {
      expect(chatRooms).toEqual(mockChatRooms);
      done();
    });

    const req = httpTestingController.expectOne((request) => request.url === `${baseApiUrl}/${parameters.role}/chatrooms`);
    req.flush(mockChatRooms);

    expect(req.request.method).toEqual('GET');
  });

  it('should get chat room by id', (done) => {
    const role = Role.provider;
    const chatRoomId = 'chatId2';
    const expectedChatRoom = mockChatRooms.find((chatRoom) => chatRoom.id === chatRoomId);

    service.getChatRoomById(role, chatRoomId).subscribe((chatRoom) => {
      expect(chatRoom).toEqual(expectedChatRoom);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/${role}/chatrooms/${chatRoomId}`);
    req.flush(expectedChatRoom);

    expect(req.request.method).toEqual('GET');
  });

  it('should get chat room for parent by workshop id', (done) => {
    const workshopId = 'workshopId1';
    const expectedChatRoom = mockChatRooms.find((chatRoom) => chatRoom.workshopId === workshopId);

    service.getChatRoomForParentByWorkshopId(workshopId).subscribe((chatRoom) => {
      expect(chatRoom).toEqual(expectedChatRoom);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/parent/chatrooms/workshop/${workshopId}`);
    req.flush(expectedChatRoom);

    expect(req.request.method).toEqual('GET');
  });

  it('should get chat room by application id', (done) => {
    const applicationId = 'applicationId';

    service.getChatRoomByApplicationId(applicationId).subscribe((chatRoom) => {
      expect(chatRoom).toEqual(mockChatRooms[0]);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/chatrooms/applications/${applicationId}`);
    req.flush(mockChatRooms[0]);

    expect(req.request.method).toEqual('GET');
  });

  it('should get chat room messages by id', (done) => {
    const role = Role.parent;
    const chatRoomId = 'chatRoomId1';
    const parameters: MessagesParameters = { from: 0, size: 10 };
    const expectedIncomingMessages = mockIncomingMessages.filter((incomingMessage) => incomingMessage.chatRoomId === chatRoomId);

    service.getChatRoomMessagesById(role, chatRoomId, parameters).subscribe((incomingMessages) => {
      expect(incomingMessages).toEqual(expectedIncomingMessages);
      done();
    });

    const req = httpTestingController.expectOne((request) => request.url === `${baseApiUrl}/${role}/chatrooms/${chatRoomId}/messages`);
    req.flush(expectedIncomingMessages);

    expect(req.request.method).toEqual('GET');
  });

  it('should get chat room messages for parent by workshop id', (done) => {
    const workshopId = 'workshopId1';
    const parameters: MessagesParameters = { from: 0, size: 10 };
    const expectedIncomingMessages = mockIncomingMessages.filter(
      (incomingMessage) => incomingMessage.chatRoomId === mockChatRooms.find((chatRoom) => chatRoom.workshopId === workshopId).id
    );

    service.getChatRoomMessagesForParentByWorkshopId(workshopId, parameters).subscribe((incomingMessages) => {
      expect(incomingMessages).toEqual(expectedIncomingMessages);
      done();
    });

    const req = httpTestingController.expectOne((request) => request.url === `${baseApiUrl}/parent/workshops/${workshopId}/messages`);
    req.flush(expectedIncomingMessages);

    expect(req.request.method).toEqual('GET');
  });

  it('should get unread messages count', (done) => {
    service.getUnreadMessagesCount().subscribe((unreadMessagesCount) => {
      expect(unreadMessagesCount).toEqual(mockIncomingMessages.length);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/user/unreadMessagesCount`);
    req.flush(mockIncomingMessages.length);

    expect(req.request.method).toEqual('GET');
  });
});
