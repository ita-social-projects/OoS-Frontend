export enum Role {
  provider = 'provider',
  parent = 'parent',
  unauthorized = 'unauthorized',
  techAdmin = 'techadmin',
  ministryAdmin = 'ministryadmin',
  regionAdmin = 'regionadmin',
  areaAdmin = 'areaadmin',
  ProviderDeputy = 'ProviderDeputy',
  ProviderAdmin = 'ProviderAdmin',
  all = 'all',
  child = 'child',
  None = 'None'
}

export enum EntityType {
  provider = 'provider',
  workshop = 'workshop',
  ProviderAdmin = 'provideradmin',
  ProviderDeputy = 'provider',
  None = 'provider'
}

export enum UserTabParams {
  all,
  parent,
  child
}
