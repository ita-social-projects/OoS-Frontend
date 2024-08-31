export enum Role {
  all = 'all',
  unauthorized = 'unauthorized',
  provider = 'provider',
  // TODO: Remove providerDeputy when position will be implemented, adjust checks
  providerDeputy = 'providerdeputy',
  employee = 'employee',
  parent = 'parent',
  techAdmin = 'techadmin',
  ministryAdmin = 'ministryadmin',
  regionAdmin = 'regionadmin',
  areaAdmin = 'areaadmin',
  moderator = 'moderator'
}

export enum UserTabParams {
  all,
  parent,
  child
}
