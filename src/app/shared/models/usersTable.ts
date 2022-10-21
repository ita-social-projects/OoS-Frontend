export interface UsersTable {
  id: string;
  pib: string;
  email: string;
  phoneNumber: string;
  status: string;
  isDeputy: boolean;
  role?:string;
}

export interface BlockData {
  user: UsersTable,
  isBlocked: boolean
}
