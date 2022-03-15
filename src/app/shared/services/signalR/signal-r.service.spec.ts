import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CheckSessionService } from 'angular-auth-oidc-client/lib/iframe/check-session.service';

import { SignalRService } from './signal-r.service';

describe('SignalRService', () => {
  let service: SignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      providers: [
        OidcSecurityService,
        CheckSessionService
      ]
    });
    service = TestBed.inject(SignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
