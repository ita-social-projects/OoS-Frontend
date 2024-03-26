import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BlockedParent } from '../../models/block.model';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  constructor(private http: HttpClient) {}

  /**
   * This method block Parent
   * @param block: BlockedParent
   */
  blockParent(blockedParent: BlockedParent): Observable<BlockedParent> {
    return this.http.post<BlockedParent>('/api/v1/BlockedProviderParent/Block', blockedParent);
  }

  /**
   * This method unblock Parent
   * @param block: BlockedParent
   */
  unBlockParent(blockedParent: BlockedParent): Observable<BlockedParent> {
    return this.http.post<BlockedParent>('/api/v1/BlockedProviderParent/UnBlock', blockedParent);
  }

  /**
   * This method get blocked parents
   * @param block: BlockedParent
   */
  getBlockedParents(providerId: string, parentId: string): Observable<BlockedParent> {
    const params = {
      params: {
        providerId: providerId,
        parentId: parentId
      }
    };
    return this.http.get<BlockedParent>('/api/v1/BlockedProviderParent/GetBlock', params);
  }

  /**
   * This method get status by childId, workshopId
   */
  getStatusIsAllowToApply(childId: string, workshopId: string): Observable<boolean> {
    const options = {
      params: {
        childId: childId,
        workshopId: workshopId
      }
    };
    return this.http.get<boolean>('/api/v1/Application/AllowedNewApplicationByChildStatus', options);
  }
}
