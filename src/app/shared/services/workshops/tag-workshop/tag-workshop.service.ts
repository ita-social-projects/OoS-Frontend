import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from 'shared/models/tag.model';
import { Util } from 'shared/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>('/api/v1/Tag/Get', {
      params: {
        localization: Util.getCurrentLocalization()
      }
    });
  }
}
