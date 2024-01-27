import { BaseAdmin, BaseAdminBlockData, BaseAdminParameters } from './admin.model';

export class RegionAdmin extends BaseAdmin {
  public catottgId: number;
  public catottgName: string;

  constructor(info, institutionId: string, regionId: number, id?: string, accountStatus?: string) {
    super(info, institutionId, id, accountStatus);
    this.catottgId = regionId;
  }
}

export interface RegionAdminParameters extends BaseAdminParameters {}
export interface RegionAdminBlockData extends BaseAdminBlockData {}
