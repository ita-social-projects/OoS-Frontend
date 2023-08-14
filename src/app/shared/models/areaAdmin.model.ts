import { BaseAdmin, BaseAdminBlockData, BaseAdminParameters } from 'shared/models/admin.model';

export class AreaAdmin extends BaseAdmin {
  public catottgId: number;
  public catottgName: string;

  constructor(info, institutionId: string, regionId: number, areaId: number, id?: string, accountStatus?: string) {
    super(info, institutionId, id, accountStatus);
    this.catottgId = areaId;
  }
}

export interface AreaAdminParameters extends BaseAdminParameters {}
export interface AreaAdminBlockData extends BaseAdminBlockData {}
