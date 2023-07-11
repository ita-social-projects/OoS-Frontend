import { AdminRoles } from 'shared/enum/admins';
import { AdminFormModel } from 'shared/models/admin-form.model';
import { BaseAdmin } from 'shared/models/admin.model';
import { MinistryAdmin } from 'shared/models/ministryAdmin.model';
import { RegionAdmin } from 'shared/models/regionAdmin.model';
import { TerritorialCommunityAdmin } from 'shared/models/territorialCommunityAdmin.model';

export class AdminFactory {
  public static createAdmin(
    adminType: AdminRoles,
    adminData: AdminFormModel,
    institutionId: string,
    regionId?: string,
    territorialCommunityId?: string,
    id?: string,
    accountStatus?: string
  ): BaseAdmin {
    switch (adminType) {
      case AdminRoles.ministryAdmin: {
        return new MinistryAdmin(adminData, institutionId, id, accountStatus);
      }
      case AdminRoles.regionAdmin: {
        return new RegionAdmin(adminData, institutionId, regionId, id, accountStatus);
      }
      case AdminRoles.territorialCommunityAdmin: {
        return new TerritorialCommunityAdmin(adminData, institutionId, regionId, territorialCommunityId, id,  accountStatus);
      }
      default: {
        return new MinistryAdmin(adminData, institutionId, id, accountStatus);
      }
    }
  }
}
