import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants, PaginationConstants } from '../../constants/constants';
import { IClass, Department, Direction, DirectionsFilter } from '../../models/category.model';
import { AdminStateModel } from '../../store/admin.state';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  private setParams(filters: AdminStateModel): HttpParams {
    let params = new HttpParams();

    if (filters.searchQuery) {
      params = params.set('Name', filters.searchQuery);
    }

    if (filters.currentPage) {
      const size: number = PaginationConstants.ITEMS_PER_PAGE_TEN;
      const from: number = size * (+filters.currentPage.element - 1);

      params = params.set('Size', size.toString());
      params = params.set('From', from.toString());
    }
    return params;
  }

  getFilteredDirections(filters: AdminStateModel): Observable<DirectionsFilter> {
    const options = { params: this.setParams(filters) };
    return this.http.get<DirectionsFilter>('/api/v1/Direction/GetByFilter', options);
  }

  getDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>('/api/v1/Direction/Get');
  }

  getTopDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>(`/api/v1/Statistic/GetDirections`);
  }
  createDirection(direction: Direction): Observable<Direction> {
    return this.http.post<Direction>('/api/v1/Direction/Create', direction);
  }
  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>('/api/v1/Department/Create', department);
  }
  updateDirection(direction: Direction): Observable<Direction> {
    return this.http.put<Direction>('/api/v1/Direction/Update', direction);
  }
  updateDepartment(department: Department): Observable<Department> {
    return this.http.put<Department>('/api/v1/Department/Update', department);
  }
  updateClass(iClass: IClass): Observable<IClass> {
    return this.http.put<IClass> ('/api/v1/Class/Update', iClass);
  }
  deleteDirection(id: number): Observable<object> {
    return this.http.delete(`/api/v1/Direction/Delete/${id}`);
  }

  getDepartmentsByDirectionId(id: number): Observable<Department[]> {
    return this.http.get<Department[]>(`/api/v1/Department/GetByDirectionId/${id}`);
  }

  getClassByDepartmentId(id: number): Observable<IClass[]> {
    return this.http.get<IClass[]>(`/api/v1/Class/GetByDepartmentId/${id}`);
  }

  getDirectionById(id: number): Observable<Direction> {
    return this.http.get<Direction>(`/api/v1/Direction/GetById/${id}`);
  }
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`/api/v1/Department/GetById/${id}`);
  }
  createClass(classes: IClass[]): Observable<IClass[]> {
    return this.http.post<IClass[]>('/api/v1/Class/CreateMultiple', classes);
  }
  deleteDepartmentById(id: number): Observable<object> {
    return this.http.delete(`/api/v1/Department/Delete/${id}`);
  }
  deleteClassById(id: number): Observable<object> {
    return this.http.delete(`/api/v1/Class/Delete/${id}`);
  }
}
