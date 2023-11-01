import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { BlockService } from './block.service';
import { BlockedParent } from 'shared/models/block.model';

describe('BlockService', () => {
  let service: BlockService;
  let httpTestingController: HttpTestingController;
  let blockedParent: BlockedParent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlockService],
    });

    service = TestBed.inject(BlockService);
    httpTestingController = TestBed.inject(HttpTestingController);
    blockedParent = new BlockedParent('providerId', 'parentId'); 
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable of BlockedParent when the request blockParent is successful', (done) => {
    service.blockParent(blockedParent)
      .subscribe((blockedParent: BlockedParent) => {
        expect(blockedParent).toBeTruthy();
        expect(blockedParent.parentId).toBe('parentId');
        expect(blockedParent.providerId).toBe('providerId');
        done();
      });

    const req = httpTestingController.expectOne('/api/v1/BlockedProviderParent/Block');
    expect(req.request.method).toEqual('POST');
    req.flush(blockedParent);
  });

  it('should return an error when the blockParent request fails', (done) => {
    service.blockParent(blockedParent)
      .subscribe({
        next: () => {
          fail();
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal server error');
          done();
        },
      });

    const req = httpTestingController.expectOne('/api/v1/BlockedProviderParent/Block');
    expect(req.request.method).toEqual('POST');
    req.flush('Blocked parent failed', { status: 500, statusText: 'Internal server error' });
  });

  it('should return an Observable of BlockedParent when the request unBlockParent is successful', (done) => {
    service.unBlockParent(blockedParent)
      .subscribe((blockedParent: BlockedParent) => {
        expect(blockedParent).toBeTruthy();
        expect(blockedParent.parentId).toBe('parentId');
        expect(blockedParent.providerId).toBe('providerId');
        done();
      });

    const req = httpTestingController.expectOne('/api/v1/BlockedProviderParent/UnBlock');
    expect(req.request.method).toEqual('POST');
    req.flush(blockedParent);
  });

  it('should return an error when the unBlockParent request fails', (done) => {
    service.unBlockParent(blockedParent)
      .subscribe({
        next: () => {
          fail();
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal server error');
          done();
        },
      });

    const req = httpTestingController.expectOne('/api/v1/BlockedProviderParent/UnBlock');
    expect(req.request.method).toEqual('POST');
    req.flush('Unblock parent failed', { status: 500, statusText: 'Internal server error' });
  });

  // it('should return an Observable of BlockedParent when the request getBlockedParents is successful', (done) => {
  //   service.getBlockedParents(blockedParent.providerId, blockedParent.parentId)
  //     .subscribe((blockedParent: BlockedParent) => {
  //       expect(blockedParent).toBeTruthy();
  //       done();
  //     });

  //   const req = httpTestingController.expectOne(req => req.url === '/api/v1/BlockedProviderParent/GetBlock');
  //   expect(req.request.method).toEqual('GET');
  //   expect(req.request.params.get('providerId')).toEqual('parentId');
  //   expect(req.request.params.get('parentId')).toEqual('parentId');

  //   req.flush(blockedParent);
  // });

  afterEach(() => {
    httpTestingController.verify();
  });
});
