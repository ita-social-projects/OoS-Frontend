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
