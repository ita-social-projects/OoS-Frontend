import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MockOidcSecurityService } from '../../mocks/mock-services';

import { SignalRService } from './signal-r.service';

describe('SignalRService', () => {
  let service: SignalRService;
  const CHAT_URL: string = '/hubs/chat';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      providers: [{ provide: OidcSecurityService, useValue: MockOidcSecurityService }]
    });
    service = TestBed.inject(SignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create hub connection', () => {
    expect(service.startConnection(CHAT_URL)).toBeTruthy();
  });
});
