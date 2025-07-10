import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Tag } from 'shared/models/tag.model';
import { Util } from 'shared/utils/utils';
import { Store } from '@ngxs/store';
import { MetaDataState } from 'shared/store/meta-data.state';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  public getTags(): Observable<Tag[]> {
    const isTagsFeatureEnabled = this.store.selectSnapshot(MetaDataState.featuresList).enableWorkshopTags;
    return isTagsFeatureEnabled
      ? this.http.get<Tag[]>('/api/v1/Tag/Get', {
          params: {
            localization: Util.getCurrentLocalization()
          }
        })
      : EMPTY;
  }
}
