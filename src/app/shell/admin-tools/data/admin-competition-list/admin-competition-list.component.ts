import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PaginationConstants } from 'shared/constants/constants';
import { Role } from 'shared/enum/role';
import { BaseAdmin } from 'shared/models/admin.model';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { CompetitionDraft, CompetitionFilterAdministration } from 'shared/models/competition.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { SearchResponse } from 'shared/models/search.model';
import { GetFilteredCompetitionDrafts } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';

@Component({
  selector: 'app-admin-competition-list',
  templateUrl: './admin-competition-list.component.html',
  styleUrls: ['./admin-competition-list.component.scss']
})
export class AdminCompetitionListComponent {
  @Select(AdminState.competitionDrafts)
  public competitions$: Observable<SearchResponse<CompetitionDraft[]>>;

  constructor(private readonly store: Store) {}

  public setCompetitionEventFiltersByDefault(
    competitionParameters: CompetitionFilterAdministration,
    role: Role,
    selectedAdmin?: BaseAdmin
  ): void {
    competitionParameters.searchString = '';
    competitionParameters.size = PaginationConstants.TABLE_ITEMS_PER_PAGE;

    switch (role) {
      case Role.techAdmin:
      case Role.moderator:
        competitionParameters.institutionId = '';
        competitionParameters.catottgId = 0;
        break;
      case Role.ministryAdmin:
        competitionParameters.institutionId = selectedAdmin.institutionId;
        competitionParameters.catottgId = 0;
        break;
      case Role.regionAdmin:
      case Role.areaAdmin:
        competitionParameters.institutionId = selectedAdmin.institutionId;
        competitionParameters.catottgId = (selectedAdmin as RegionAdmin | AreaAdmin).catottgId;
        break;
    }
  }

  public onGetCompetitionEventsByFilter(competitionParameters: CompetitionFilterAdministration): void {
    this.store.dispatch(new GetFilteredCompetitionDrafts(competitionParameters));
  }
}
