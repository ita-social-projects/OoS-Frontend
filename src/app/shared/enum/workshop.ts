export enum WorkshopType {
  Workshop = 'workshop',
  Draft = 'draft',
  Competition = 'competition'
}

export enum PayRateType {
  None = 0,
  Classes,
  Month,
  Day,
  Year,
  Hour,
  Course,
  AllPeriod
}

export enum WorkshopOpenStatus {
  Open = 'Open',
  Closed = 'Closed',
  Draft = 'Draft'
}

export enum WorkshopDraftStatus {
  Draft = 'Draft',
  PendingModeration = 'PendingModeration',
  Rejected = 'Rejected',
  EditedByModerator = 'EditedByModerator',
  Approved = 'Approved'
}

export enum DetailsTabTitlesParams {
  'AboutWorkshop',
  'AboutProvider',
  'Teachers',
  'OtherWorkshops',
  'Reviews',
  'Achievements',
  'Contacts'
}

export enum FormOfLearning {
  Offline = 'Offline',
  Online = 'Online',
  Mixed = 'Mixed'
}

export enum Coverage {
  School = 'School',
  City = 'City',
  District = 'District',
  Region = 'Region',
  AllUkraine = 'AllUkraine',
  International = 'International'
}

export enum SpecialNeedsType {
  None = 'None',
  Hearing = 'Hearing',
  Speaking = 'Speaking',
  Sight = 'Sight',
  Intelligence = 'Intelligence',
  Musculoskeletal = 'Musculoskeletal',
  Retardation = 'Retardation'
}

export enum EducationalShift {
  First = 'First',
  Second = 'Second'
}

export enum AgeComposition {
  SameAge = 'SameAge',
  DifferentAge = 'DifferentAge'
}

export enum GroupType {
  Workshop = 'Workshop',
  CreativeUnion = 'CreativeUnion',
  Studio = 'Studio',
  Section = 'Section'
}

export enum SocialNetworks {
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  Website = 'Website'
}
