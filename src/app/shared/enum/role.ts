export enum Role {
  provider = 'provider',
  parent = 'parent',
  unauthorized = 'unauthorized',
  techAdmin = 'techadmin',
  ministryAdmin = 'ministryadmin',
  ProviderDeputy = 'ProviderDeputy',
  ProviderAdmin = 'ProviderAdmin',
  all = 'all',
  child = 'child',
  None = 'None'
}

export enum RoleLinks {
  provider = 'ENUM.ROLE_LINKS.PROVIDER',
  parent = 'ENUM.ROLE_LINKS.PARENT'
}

export enum EntityType {
  provider = 'provider',
  workshop = 'workshop',
  ProviderAdmin = 'provideradmin',
  ProviderDeputy = 'provider',
  None = 'provider'
}