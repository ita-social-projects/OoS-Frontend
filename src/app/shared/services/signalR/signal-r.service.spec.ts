import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { SignalRService } from './signal-r.service';

describe('SignalRService', () => {
  let service: SignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      providers: [
        OidcSecurityService
      ]
    });
    service = TestBed.inject(SignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
