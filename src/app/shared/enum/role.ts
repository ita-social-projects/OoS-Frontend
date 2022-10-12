export enum Role {
  provider = 'provider',
  parent = 'parent',
  unauthorized = 'unauthorized',
  techAdmin = 'techadmin',
  ministryadmin= 'ministryadmin',
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
  ministryadmin = 'MinistryAdmin',
}

export enum RoleLinks {
  provider = 'заклад',
  parent = 'дітей'
}

export enum EntityType {
  provider = 'provider',
  workshop = 'workshop',
  ProviderAdmin = 'provideradmin',
  ProviderDeputy = 'provider',
  None = 'provider'
}
