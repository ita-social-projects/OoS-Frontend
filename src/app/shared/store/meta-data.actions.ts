import { Department, Direction, IClass } from '../models/category.model';
import { City } from '../models/city.model';

export class GetDirections {
  static readonly type = '[meta-data] Get Directions';
}

export class GetTopDirections {
  static readonly type = '[meta-data] Get Top Directions';
}

export class GetDepartments {
  static readonly type = '[meta-data] Get Departments by Direction Id';
  constructor(public payload: number) { }
}

export class GetClasses {
  static readonly type = '[meta-data] Get Classes by Department Id ';
  constructor(public payload: number) { }
}

export class CityList {
  static readonly type = '[meta-data] Get list of cities';
  constructor(public payload: City[]) { }
}

export class GetSocialGroup {
  static readonly type = '[meta-data] Get GetSocialGroup';
  constructor() { }
}

export class GetInstitutionStatus{
  static readonly type = '[meta-data] Get GetInstitutionStatus';
  constructor() { }
}

export class ClearClasses {
  static readonly type = '[meta-data] clear classes state';
}

export class ClearDepartments {
  static readonly type = '[meta-data] clear departments state';
}

export class GetCities {
  static readonly type = '[meta-data] Get Cities';
  constructor(public payload: string) { }
}

export class ClearCities {
  static readonly type = '[meta-data] clear cities state';
}

export class ClearRatings {
  static readonly type = '[meta-data] clear ratings state';
}

export class FilteredDirectionsList {
  static readonly type = '[meta-data] Get list of filtered directions';
  constructor(public payload: Direction[]) { }
}

export class FilteredDepartmentsList {
  static readonly type = '[meta-data] Get list of filtered departments';
  constructor(public payload: Department[]) { }
}

export class FilteredClassesList {
  static readonly type = '[meta-data] Get list of filtered classes';
  constructor(public payload: IClass[]) { }
}

export class GetRateByEntityId {
  static readonly type = '[meta-data] Get Rate';
  constructor(public enitityType: string, public entitytId: string) { }
}

export class GetFeaturesList {
  static readonly type = '[meta-data] Get features list';
  constructor() { }
}

export class GetAllInstitutions {
  static readonly type = '[meta-data] Get All Institutions';
  constructor() { }
}

export class GetAchievementsType {
  static readonly type = '[meta-data] Get All Achievement Types';
  constructor() { }
}

export class GetFieldDescriptionByInstitutionId {
  static readonly type = '[meta-data] Get Field Description By Institution Id';
  constructor(public payload: string) { }
}

export class GetAllByInstitutionAndLevel {
  static readonly type = '[meta-data] Get All By Institution And Level';
  constructor(public institutionId: string, public level: number) { }
}

export class GetInstitutionHierarchyChildrenById {
  static readonly type = '[meta-data ]Get Institution Hierarchy Children By Id';
  constructor(public id: string) { }
}

export class ResetInstitutionHierarchy {
  static readonly type = '[meta-data] Reset Institution Hierarchy';

  constructor() {
  }
}

export class GetInstitutionHierarchyParentsById {
  static readonly type = '[meta-data] Get Institution Hierarchy Parents By Id';

  constructor(public id: string) {
  }
}

export class GetCodeficatorSearch {
  static readonly type = '[meta-data] Get Codeficator search';

  constructor(public payload: string) {
  }
}

export class GetCodeficatorById {
  static readonly type = '[meta-data] Get Codeficator By Id';

  constructor(public id: number) {
  }
}

export class ClearCodeficatorSearch {
  static readonly type = '[meta-data] Clear Codeficator state';
}
