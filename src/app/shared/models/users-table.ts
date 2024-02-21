import { AdminRoles } from 'shared/enum/admins';

interface BaseTableData {
  id: string;
  pib: string;
  email: string;
  phoneNumber: string;
  status: string;
}

export interface UsersTableData extends BaseTableData {
  role: string;
  isBlocked: boolean;
  parentId: string;
  parentFullName: string;
}

export interface AdminsTableData extends BaseTableData {
  institutionTitle: string;
  catottgName: string;
  regionName: string;
  isAdmin: true;
}

export interface ProviderAdminsTableData extends BaseTableData {
  role: string;
  isDeputy: boolean;
}

export type UnionTableData = UsersTableData | AdminsTableData | ProviderAdminsTableData;

interface BaseBlockData {
  isBlocking: boolean;
}

export interface UsersBlockData extends BaseBlockData {
  user: UsersTableData;
}

export interface AdminsBlockData extends BaseBlockData {
  user: AdminsTableData;
}

export interface ProviderAdminsBlockData extends BaseBlockData {
  user: ProviderAdminsTableData;
}

export interface InvitationData {
  user: AdminsTableData;
  adminType: AdminRoles;
}
