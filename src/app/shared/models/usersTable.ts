export interface UsersTable {
  id: string;
  pib: string;
  email: string;
  phoneNumber: string;
  status: string;
  isDeputy: boolean;
  role?:string;
}

export interface BlockDate {
  user: UsersTable,
  isBlocked: boolean
}
