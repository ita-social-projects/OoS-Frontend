import { AllMinistryAdmins, MinistryAdmin } from './../../models/ministryAdmin.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatorState } from '../../store/paginator.state';
import { PaginationElement } from '../../models/paginationElement.model';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class MinistryAdminService {

  constructor(
    private http: HttpClient, 
    private store: Store, 
  ) {}

  private setParams( searchString?:string ): HttpParams {
    let params = new HttpParams();

    if(searchString){
      params = params.set('SearchString', searchString);
    }
    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size: number = this.store.selectSnapshot(PaginatorState.adminsPerPage);
    const from: number = size * (+currentPage.element - 1);
    
    params = params.set('Size', size.toString());
    params = params.set('From', from.toString());

    return params;
  }
  
  /**
  * This method get Profile of authorized MinistryAdmin
  */
  getMinistryAdminProfile(): Observable<MinistryAdmin>{
    return this.http.get<MinistryAdmin>(`/api/v1/MinistryAdmin/Profile`);
  }

  /**
   * This method get All Ministry Admins
   */
  getAllMinistryAdmin(searchString: string): Observable<AllMinistryAdmins> {
    const options = { params: this.setParams(searchString) };

    return this.http.get<AllMinistryAdmins>(`/api/v1/MinistryAdmin/GetByFilter`, options);
  }

  /**
   * This method create Ministry Admin
   * @param ministryAdmin: MinistryAdmin
   */
  createMinistryAdmin(ministryAdmin: MinistryAdmin): Observable<MinistryAdmin> {
    return this.http.post<MinistryAdmin>('/api/v1/MinistryAdmin/Create', ministryAdmin);
  }

  /**
   * This method delete Ministry Admin by id
   * @param ministryAdminId: string
   */
  deleteMinistryAdmin(ministryAdminId: string): Observable<object> {
    let params = new HttpParams();
    params = params.set('ministryAdminId', `${ministryAdminId}`);
    return this.http.delete(`/api/v1/MinistryAdmin/Delete`, { params });
  }

  /**
   * This method block Ministry Admin
   * @param ministryAdminId: string
   */
  blockMinistryAdmin(ministryAdminId: string): Observable<object> {
    let params = new HttpParams();
    params = params.set('ministryAdminId', `${ministryAdminId}`);

    return this.http.put(`/api/v1/MinistryAdmin/Block`, {}, { params });
  }

}
