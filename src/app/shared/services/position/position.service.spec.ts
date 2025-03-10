import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Position, PositionParameters } from 'shared/models/position.model';
import { SearchResponse } from 'shared/models/search.model';
import { PositionService } from './position.service';

describe('PositionService', () => {
  let service: PositionService;
  let httpTestingController: HttpTestingController;

  const mockBaseUrl = '/api/v1/providers';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), HttpClientTestingModule],
      providers: [PositionService]
    });
    service = TestBed.inject(PositionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request and return positions', () => {
    const mockParameters: PositionParameters = {
      providerId: '1',
      orderByFullName: true,
      orderByCreatedAt: false,
      searchString: '',
      from: 0,
      size: 10
    };
    const mockResponse: SearchResponse<Position[]> = {
      entities: [{ id: '1', providerId: '1', fullName: 'Position 1' } as Position],
      totalAmount: 1
    };

    service.getPositions(mockParameters).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${mockBaseUrl}/${mockParameters.providerId}/positions/GetByFilter?SearchString=&From=0&Size=10&OrderByCreatedAt=false&OrderByFullName=true`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should send a POST request to create a position', () => {
    const mockPosition: Position = { id: '1', providerId: '1', fullName: 'New Position' } as Position;

    service.createPosition(mockPosition).subscribe((response) => {
      expect(response).toEqual(mockPosition);
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${mockPosition.providerId}/positions/Create`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPosition);
    req.flush(mockPosition);
  });

  it('should send a PUT request to update a position', () => {
    const mockPosition: Position = { id: '1', providerId: '1', fullName: 'Updated Position' } as Position;

    service.updatePosition(mockPosition).subscribe((response) => {
      expect(response).toEqual(mockPosition);
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${mockPosition.providerId}/positions/Update/${mockPosition.id}`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPosition);
    req.flush(mockPosition);
  });

  it('should send a DELETE request to remove a position', () => {
    const mockParameters: PositionParameters = { providerId: '1', from: 0, size: 10 };
    const positionId = '1';

    service.deletePosition(mockParameters, positionId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${mockParameters.providerId}/positions/Delete/${positionId}`);

    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should send a GET request to retrieve a position by ID', () => {
    const positionId = '1';
    const providerId = '1';
    const mockPosition: Position = { id: positionId, providerId: providerId, fullName: 'Position 1' } as Position;

    service.getPositionById(positionId, providerId).subscribe((response) => {
      expect(response).toEqual(mockPosition);
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${providerId}/positions/GetById/${positionId}`);

    expect(req.request.method).toBe('GET');

    req.flush(mockPosition);
  });

  it('should throw an error if providerId is missing', (done) => {
    const positionId = '1';
    const providerId = '';

    service.getPositionById(positionId, providerId).subscribe({
      error: (error) => {
        expect(error.message).toBe('Provider ID is not available');
        done();
      }
    });

    httpTestingController.expectNone('/');
  });
});
