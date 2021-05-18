export interface User {
  creatingTime?: string;
  lastLogin?: string;
  lastName?: string;
  middleName?: string;
  firstName?: string;
  id: string;
  userName?: string;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emnailConfirmed?: boolean;
  passwordHash?: string;
  securityStamp?: string;
  concurrencyStamp?: string;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: any;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
}
