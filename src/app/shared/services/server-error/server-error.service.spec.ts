import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { ServerErrorService } from './server-error.service';

describe('ServerErrorService', () => {
  let service: ServerErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(ServerErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
