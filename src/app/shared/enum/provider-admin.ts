export enum providerAdminRole {
  all = 'all',
  deputy = 'deputy',
  admin = 'admin',
}

export enum ProviderAdminStatus {
  NeverLogged = 'NeverLogged',
  Accepted = 'Accepted',
  Blocked = 'Blocked',
  Pending = 'Pending',
}
export enum ProviderAdminIcons {
  NeverLogged = 'fas fa-user-clock',
  Pending = 'fas fa-user-clock',
  Accepted = 'fas fa-user-check',
  Blocked = 'fas fa-user-times',
}