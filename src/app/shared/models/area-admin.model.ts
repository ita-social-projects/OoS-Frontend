import { BaseAdmin, BaseAdminBlockData, BaseAdminParameters } from 'shared/models/admin.model';

export class AreaAdmin extends BaseAdmin {
  public catottgId: number;
  public catottgName: string;
  public regionId: number;
  public regionName: string;

  constructor(info: Partial<AreaAdmin>, institutionId: string, regionId: number, areaId: number, id?: string, accountStatus?: string) {
    super(info, institutionId, id, accountStatus);
    this.catottgId = areaId;
    this.regionId = regionId;
  }
}

export type AreaAdminParameters = BaseAdminParameters;
export type AreaAdminBlockData = BaseAdminBlockData;
