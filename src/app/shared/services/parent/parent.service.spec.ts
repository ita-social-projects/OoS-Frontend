import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { Parent, ParentBlockedData } from 'shared/models/parent.model';
import { ParentService } from './parent.service';

describe('ParentService', () => {
  const baseApiUrl = '/api/v1/parents';
  let service: ParentService;
  let httpTestingController: HttpTestingController;
  const mockParent: Parent = {
    id: 'id',
    userId: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()]
    });
    service = TestBed.inject(ParentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get profile', (done) => {
    service.getProfile().subscribe((profile) => {
      expect(profile).toEqual(mockParent);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/profile`);
    req.flush(mockParent);

    expect(req.request.method).toEqual('GET');
  });

  it('should get block parent', (done) => {
    const parentBlockedData: ParentBlockedData = { parentId: 'id', isBlocked: true, reason: 'reason' };

    service.blockUnblockParent(parentBlockedData).subscribe(done);

    const req = httpTestingController.expectOne(`${baseApiUrl}/BlockUnblockParent`);
    req.flush(null);

    expect(req.request.method).toEqual('POST');
  });
});
