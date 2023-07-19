import { BaseAdmin, BaseAdminBlockData, BaseAdminParameters } from 'shared/models/admin.model';

export class TerritorialCommunityAdmin extends BaseAdmin {
  public catottgId: number;
  public catottgName: string;

  constructor(info, institutionId: string, regionId: number, territorialCommunityId: number, id?: string, accountStatus?: string) {
    super(info, institutionId, id, accountStatus);
    this.catottgId = territorialCommunityId;
  }
}

export interface TerritorialCommunityAdminParameters extends BaseAdminParameters {}
export interface TerritorialCommunityAdminBlockData extends BaseAdminBlockData {}
