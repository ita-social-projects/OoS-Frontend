import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { Employee, EmployeeParameters } from 'shared/models/employee.model';
import { SearchResponse } from 'shared/models/search.model';
import { OfficialEmployee } from 'shared/models/official-employee.model';
import { EmployeeBlockData } from 'shared/models/block.model';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])],
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET employee by id', () => {
    const mockEmployee: Employee = { id: '1', firstName: 'John', lastName: 'Smith', email: 'email', phoneNumber: 'number' };
    const employeeId = '1';

    service.getEmployeeById(employeeId).subscribe((employee) => {
      expect(employee).toEqual(mockEmployee);
    });

    const req = httpMock.expectOne(`/api/v1/Employees/GetEmployeeById/${employeeId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockEmployee);
  });

  it('should GET filtered official employees', () => {
    const filterParams: EmployeeParameters = {
      searchString: 'John',
      from: 0,
      size: 10,
      providerId: '1'
    };

    const mockResponse: SearchResponse<OfficialEmployee[]> = {
      entities: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          position: 'employee',
          positionId: '1',
          rnokpp: '111',
          dismissalOrder: '',
          recruitmentOrder: '',
          dismissalReason: '',
          employmentType: '',
          activeFrom: '',
          activeTo: ''
        }
      ],
      totalAmount: 1
    };

    service.getFilteredOfficialEmployees(filterParams).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`/api/v1/providers/${filterParams.providerId}/officials/Get?searchString=John&from=0&size=10`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should create a new employee', () => {
    const newEmployee: Employee = { id: '1', firstName: 'John', lastName: 'Smith', email: 'email', phoneNumber: '+000' };

    service.createEmployee(newEmployee).subscribe((response) => {
      expect(response).toEqual(newEmployee);
    });

    const req = httpMock.expectOne('/api/v1/Employees/Create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEmployee);

    req.flush(newEmployee);
  });

  it('should DELETE an employee', () => {
    const employeeId = '1';
    const providerId = '1';

    service.deleteEmployee(employeeId, providerId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`/api/v1/Employees/Delete?employeeId=${employeeId}&providerId=${providerId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should block an employee successfully', () => {
    const employeeBlockParams: EmployeeBlockData = {
      userId: '1',
      providerId: '1',
      isBlocked: true
    };

    service.blockEmployee(employeeBlockParams).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(
      `/api/v1/Employees/Block?employeeId=${employeeBlockParams.userId}&providerId=${employeeBlockParams.providerId}&isBlocked=true`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});

    req.flush(null);
  });

  it('should update an employee successfully', () => {
    const providerId = '1';
    const updatedEmployee: Employee = { id: '1', firstName: 'John', lastName: 'Smith', email: 'email', phoneNumber: 'number' };

    service.updateEmployee(providerId, updatedEmployee).subscribe((response) => {
      expect(response).toEqual(updatedEmployee);
    });

    const req = httpMock.expectOne(`/api/v1/Employees/Update?providerId=${providerId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedEmployee);

    req.flush(updatedEmployee);
  });

  it('should reinvite an employee successfully', () => {
    const employee: Employee = { id: '1', firstName: 'John', lastName: 'Smith', email: 'email', phoneNumber: 'number' };

    service.reinvateEmployee(employee).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`/api/v1/Employees/Reinvite/${employee.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(employee);

    req.flush(null);
  });
});
