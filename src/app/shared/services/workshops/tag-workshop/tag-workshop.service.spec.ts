import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tag } from 'shared/models/tag.model';
import { Util } from 'shared/utils/utils';
import { TagService } from './tag-workshop.service';

describe('TagService', () => {
  let service: TagService;
  let store: Store;
  let http: HttpClient;

  beforeEach(() => {
    store = {
      selectSnapshot: jest.fn().mockReturnValue({ enableWorkshopTags: true })
    } as unknown as Store;
    http = {
      get: jest.fn()
    } as unknown as HttpClient;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])],
      providers: [
        { provide: Store, useValue: store },
        { provide: HttpClient, useValue: http }
      ]
    });

    service = TestBed.inject(TagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send request if tag feature is enabled', (done) => {
    const mockTags: Tag[] = [{ id: 1, name: 'tag1' }];

    http.get = jest.fn().mockReturnValue(of(mockTags));

    service.getTags().subscribe((result) => {
      expect(result).toEqual(mockTags);
      expect(http.get).toHaveBeenCalledWith('/api/v1/Tag/Get', {
        params: { localization: Util.getCurrentLocalization() }
      });
      done();
    });
  });

  it('should NOT send request if tag feature is disabled', (done) => {
    store.selectSnapshot = jest.fn().mockReturnValue({ enableWorkshopTags: false });

    service.getTags().subscribe({
      next: () => fail(),
      complete: () => {
        expect(http.get).not.toHaveBeenCalled();
        done();
      }
    });
  });
});
