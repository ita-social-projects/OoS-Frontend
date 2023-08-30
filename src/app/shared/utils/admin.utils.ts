import { AdminRoles } from 'shared/enum/admins';
import { Role } from 'shared/enum/role';
import { AdminFormModel } from 'shared/models/admin-form.model';
import { BaseAdmin } from 'shared/models/admin.model';
import { AreaAdmin } from 'shared/models/areaAdmin.model';
import { MinistryAdmin } from 'shared/models/ministryAdmin.model';
import { RegionAdmin } from 'shared/models/regionAdmin.model';

export class AdminFactory {
  public static createAdmin(
    adminType: AdminRoles,
    adminData: AdminFormModel,
    institutionId: string,
    regionId?: number,
    territorialCommunityId?: number,
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
      case AdminRoles.areaAdmin: {
        return new AreaAdmin(adminData, institutionId, regionId, territorialCommunityId, id, accountStatus);
      }
      default: {
        return new MinistryAdmin(adminData, institutionId, id, accountStatus);
      }
    }
  }
}

export function isRoleAdmin(role: string): boolean {
  return [Role.techAdmin, Role.ministryAdmin, Role.regionAdmin, Role.areaAdmin].includes(role as Role);
}

export function canManageInstitution(role: string): boolean {
  return role === Role.techAdmin || role === Role.ministryAdmin;
}

export function canManageRegion(role: string): boolean {
  return canManageInstitution(role) || role === Role.regionAdmin;
}
