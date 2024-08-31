import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PaginationConstants } from 'shared/constants/constants';
import { Role } from 'shared/enum/role';
import { BaseAdmin } from 'shared/models/admin.model';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop, WorkshopFilterAdministration } from 'shared/models/workshop.model';
import { GetFilteredWorkshops } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';

@Component({
  selector: 'app-admin-workshop-list',
  templateUrl: './admin-workshop-list.component.html',
  styleUrls: ['./admin-workshop-list.component.scss']
})
export class AdminWorkshopListComponent {
  @Select(AdminState.workshops)
  public workshops$: Observable<SearchResponse<Workshop[]>>;

  constructor(private readonly store: Store) {}

  public setWorkshopsFiltersByDefault(workshopParameters: WorkshopFilterAdministration, role: Role, selectedAdmin?: BaseAdmin): void {
    workshopParameters.searchString = '';
    workshopParameters.size = PaginationConstants.TABLE_ITEMS_PER_PAGE;

    switch (role) {
      case Role.ministryAdmin:
        workshopParameters.institutionId = selectedAdmin.institutionId;
        workshopParameters.catottgId = 0;
        break;
      case Role.regionAdmin:
      case Role.areaAdmin:
        workshopParameters.institutionId = selectedAdmin.institutionId;
        workshopParameters.catottgId = (selectedAdmin as RegionAdmin | AreaAdmin).catottgId;
        break;
      default:
        workshopParameters = {
          searchString: '',
          size: PaginationConstants.TABLE_ITEMS_PER_PAGE,
          institutionId: '',
          catottgId: 0
        };
    }
  }

  public onGetWorkshopsByFilter(workshopParameters: WorkshopFilterAdministration): void {
    this.store.dispatch(new GetFilteredWorkshops(workshopParameters));
  }
}
