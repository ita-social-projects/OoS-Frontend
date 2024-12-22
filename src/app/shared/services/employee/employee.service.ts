import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmployeeBlockData } from 'shared/models/block.model';
import { Employee, EmployeeParameters } from 'shared/models/employee.model';
import { SearchResponse } from 'shared/models/search.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  /**
   * This method get employee by id
   * @param id string
   */
  public getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`/api/v1/Employees/GetEmployeeById/${id}`);
  }

  /**
   * This method get provider admisn with filter parameters
   */
  public getFilteredEmployees(filterParams: EmployeeParameters): Observable<SearchResponse<Employee[]>> {
    const params = new HttpParams()
      .set('searchString', `${filterParams.searchString}`)
      .set('from', `${filterParams.from}`)
      .set('size', `${filterParams.size}`);

    return this.http.get<SearchResponse<Employee[]>>('/api/v1/Employees/GetFilteredEmployees', {
      params
    });
  }

  /**
   * This method create Employee
   * @param employee: Employee
   */
  public createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>('/api/v1/Employees/Create', employee);
  }

  /**
   * This method delete Employee
   * @param employeeId: string
   * @param providerId: string
   */
  public deleteEmployee(employeeId: string, providerId: string): Observable<void> {
    const params = new HttpParams().set('employeeId', `${employeeId}`).set('providerId', `${providerId}`);

    return this.http.delete<void>('/api/v1/Employees/Delete', { params });
  }

  /**
   * This method delete Employee
   * @param employeeBlockParams: EmployeeBlockData
   */
  public blockEmployee(employeeBlockParams: EmployeeBlockData): Observable<void> {
    const params = new HttpParams()
      .set('employeeId', `${employeeBlockParams.userId}`)
      .set('providerId', `${employeeBlockParams.providerId}`)
      .set('isBlocked', `${employeeBlockParams.isBlocked}`);

    return this.http.put<void>('/api/v1/Employees/Block', {}, { params });
  }

  /**
   * This method update Employee
   * @param providerId: string
   * @param employee: Employee
   */
  public updateEmployee(providerId: string, employee: Employee): Observable<Employee> {
    const params = new HttpParams().set('providerId', `${providerId}`);

    return this.http.put<Employee>('/api/v1/Employees/Update', employee, { params });
  }

  /**
   * This method reinvites employee
   * @param employee: Employee
   */
  public reinvateEmployee(employee: Employee): Observable<void> {
    return this.http.put<void>(`/api/v1/Employees/Reinvite/${employee.id}`, employee);
  }
}
