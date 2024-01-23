import { AdminRoles } from 'shared/enum/admins';

export interface UsersTable {
  id: string;
  pib: string;
  email: string;
  phoneNumber: string;
  status: string;
  isDeputy: boolean;
  role?: string;
  isBlocked: boolean;
  parentId: string;
  parentFullName: string;
}

export interface BlockData {
  user: UsersTable;
  isBlocked: boolean;
}

export interface InvitationData {
  user: UsersTable;
  adminType: AdminRoles;
}
