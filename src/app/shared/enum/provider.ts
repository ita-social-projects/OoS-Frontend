export enum ProviderType {
  FOP,
  Social,
  TOV,
  Private,
  EducationalInstitution,
  Other,
}

export enum ProviderTypeUkr {
  'ФОП',
  'Громадська організація',
  'ТОВ',
  'ПП',
  'Заклад освіти',
  'Інше',
}

export enum OwnershipType {
  State,
  Common,
  Private,
}

export enum OwnershipTypeUkr {
  State = 'Державна',
  Common = 'Комунальна',
  Private = 'Приватна',
}

export enum WorkshopType {
  Group,
  Section,
  Class,
}

export enum WorkshopTypeUkr {
  'Гурток',
  'Секція',
  'Клас',
}

export enum CreateProviderSteps {
  'info',
  'contacts',
  'description'
}

export enum ProviderWorkshopSameValues {
  email = 'email',
  phone = 'phoneNumber',
  website = 'website',
  facebook = 'facebook',
  instagram = 'instagram'
}

export enum InstitutionTypes {
  Complex = 'Комплексний',
  Profile = 'Профільний',
  Specialized = 'Спеціалізований'
}

export enum PayRateType {
  Classes,
  Month,
  Day,
  Year,
  Hour,
  Course,
  AllPeriod
}

export enum PayRateTypeUkr {
  Classes = 'Заняття',
  Month = 'Місяць',
  Day = 'День',
  Year = 'Рік',
  Hour = 'Година',
  Course = 'Курс',
  AllPeriod = 'Увесь період'
}