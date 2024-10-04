import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application, ApplicationFilterParameters } from 'shared/models/application.model';
import { Direction } from 'shared/models/category.model';
import { MinistryAdmin, MinistryAdminParameters } from 'shared/models/ministry-admin.model';
import { Provider, ProviderBlock, ProviderParameters } from 'shared/models/provider.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { SearchResponse } from 'shared/models/search.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseApiUrl = '/api/v1/Admin';

  constructor(private http: HttpClient) {}

  public getAllMinistryAdmins(parameters: MinistryAdminParameters): Observable<SearchResponse<MinistryAdmin[]>> {
    const options = { params: this.setMinistryAdminParams(parameters) };

    return this.http.get<SearchResponse<MinistryAdmin[]>>(`${this.baseApiUrl}/GetByFilterMinistryAdmin`, options);
  }

  public getAllApplications(parameters: ApplicationFilterParameters): Observable<SearchResponse<Application[]>> {
    const options = { params: this.setApplicationParams(parameters) };

    return this.http.get<SearchResponse<Application[]>>(`${this.baseApiUrl}/GetApplications`, options);
  }

  public getAllProviders(parameters: ProviderParameters): Observable<SearchResponse<Provider[]>> {
    const options = { params: this.setProviderParams(parameters) };

    return this.http.get<SearchResponse<Provider[]>>(`${this.baseApiUrl}/GetProviderByFilter`, options);
  }

  public updateDirection(direction: Direction): Observable<Direction> {
    return this.http.put<Direction>(`${this.baseApiUrl}/UpdateDirections`, direction);
  }

  public deleteDirection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/DeleteDirectionById/${id}`);
  }

  public blockProvider(provider: ProviderBlock): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/BlockProvider`, provider);
  }

  private setMinistryAdminParams(parameters: MinistryAdminParameters = { searchString: '' }): HttpParams {
    return this.setDefaultParams(parameters);
  }

  private setApplicationParams(parameters: ApplicationFilterParameters): HttpParams {
    let params = this.setDefaultParams(parameters);

    if (parameters) {
      if (parameters.statuses.length) {
        parameters.statuses.forEach((status: ApplicationStatuses) => (params = params.append('Statuses', status)));
      }
      if (parameters.workshops?.length) {
        parameters.workshops.forEach((workshopId: string) => (params = params.append('Workshops', workshopId)));
      }
      if (parameters.children?.length) {
        parameters.children.forEach((childrenId: string) => (params = params.append('Children', childrenId)));
      }
      params = params.set('Show', parameters.show.toString());
    }
    params = params.set('OrderByDateAscending', 'true').set('OrderByAlphabetically', 'true').set('OrderByStatus', 'true');

    return params;
  }

  private setProviderParams(parameters: ProviderParameters): HttpParams {
    let params = this.setDefaultParams(parameters);

    if (parameters.institutionId) {
      params = params.set('InstitutionId', parameters.institutionId);
    }
    if (parameters.catottgId) {
      params = params.set('CATOTTGId', parameters.catottgId);
    }

    return params;
  }

  private setDefaultParams(parameters: PaginationParameters & { searchString?: string }): HttpParams {
    let params = new HttpParams();

    if (parameters.size) {
      params = params.set('Size', parameters.size.toString());
    }
    if (parameters.from) {
      params = params.set('From', parameters.from.toString());
    }
    if (parameters.searchString) {
      params = params.set('SearchString', parameters.searchString);
    }

    return params;
  }
}
