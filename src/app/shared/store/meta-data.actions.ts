export class GetDirections {
  static readonly type = '[meta-data] Get Directions';
}

export class GetSocialGroup {
  static readonly type = '[meta-data] Get get social groups';
  constructor() {}
}

export class GetInstitutionStatuses {
  static readonly type = '[meta-data] get institution statuses';
  constructor() {}
}

export class GetProviderTypes {
  static readonly type = '[meta-data] get provider types';
  constructor() {}
}

export class ClearRatings {
  static readonly type = '[meta-data] clear ratings state';
}

export class GetRateByEntityId {
  static readonly type = '[meta-data] get rate';
  constructor(public enitityType: string, public entitytId: string) {}
}

export class GetFeaturesList {
  static readonly type = '[meta-data] Get features list';
  constructor() {}
}

export class GetAllInstitutions {
  static readonly type = '[meta-data] Get All Institutions';
  constructor(public filterNonGovernment: boolean) {}
}

export class GetAllInstitutionsHierarchy {
  static readonly type = '[meta-data] Get All Institutions Hierarchy';
  constructor() {}
}

export class GetAchievementsType {
  static readonly type = '[meta-data] Get All Achievement Types';
  constructor() {}
}

export class GetFieldDescriptionByInstitutionId {
  static readonly type = '[meta-data] Get Field Description By Institution Id';
  constructor(public payload: string) {}
}

export class GetAllByInstitutionAndLevel {
  static readonly type = '[meta-data] Get All By Institution And Level';
  constructor(public institutionId: string, public level: number) {}
}

export class GetInstitutionHierarchyChildrenById {
  static readonly type = '[meta-data ]Get Institution Hierarchy Children By Id';
  constructor(public id: string) {}
}

export class ResetInstitutionHierarchy {
  static readonly type = '[meta-data] Reset Institution Hierarchy';

  constructor() {}
}

export class GetInstitutionHierarchyParentsById {
  static readonly type = '[meta-data] Get Institution Hierarchy Parents By Id';

  constructor(public id: string) {}
}

export class GetCodeficatorSearch {
  static readonly type = '[meta-data] Get Codeficator search';

  constructor(public payload: string) {}
}

export class GetCodeficatorById {
  static readonly type = '[meta-data] Get Codeficator By Id';

  constructor(public id: number) {}
}

export class ClearCodeficatorSearch {
  static readonly type = '[meta-data] Clear Codeficator state';
}
