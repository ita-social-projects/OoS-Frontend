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

export enum PersonalInfoRole {
  provider = 'Provider',
  parent = 'Parent',
  techadmin = 'TechAdmin',
  ministryadmin = 'MinistryAdmin'
}

export enum RoleLinks {
  provider = 'ENUM.ROLE_LINKS.PROVIDER',
  parent = 'ENUM.ROLE_LINKS.PARENT'
}

export enum EntityType {
  parent = 'parent',
  provider = 'provider',
  workshop = 'workshop',
  ProviderAdmin = 'provideradmin',
  ProviderDeputy = 'provider',
  None = 'provider'
}