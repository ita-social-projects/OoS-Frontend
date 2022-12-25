// Statuses for Provider Lisence Review
export enum LicenseStatuses {
  NotProvided = 'NotProvided',
  Pending = 'Pending',
  Approved = 'Approved',
}

// Statuses for Provider Data Review 
export enum ProviderStatuses {
  Approved = 'Approved',
  Pending = 'Pending',
  Editing = 'Editing',
}

// Statuses for Ministry Admin Logging
export enum UserStatuses {
  NeverLogged = 'NeverLogged',
  Accepted = 'Accepted',
  Blocked = 'Blocked',
}

// Statuses for Applications
export enum ApplicationStatuses {
  Pending = 'Pending',
  AcceptedForSelection = 'AcceptedForSelection',
  Approved = 'Approved',
  StudyingForYears = 'StudyingForYears',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Left = 'Left',
  Blocked = 'Blocked',
}

// Statuses for user Email Confirmation
export enum EmailConfirmationStatuses {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
}

//UKRAINIAN TRANSLATION
//TODO: should be localized

export enum ApplicationStatusTitles {
  All = 'Усі',
  Pending = 'Очікує підтвердження',
  Approved = 'Зараховано',
  Rejected = 'Відмовлено',
  Left = 'Гурток залишено',
  AcceptedForSelection = 'Прийнято до конкурсного відбору',
  StudyingForYears = 'Навчається 1-11 років',
  Completed = 'Навчання завершено',
  Blocked = 'Заблоковано'
}

// Statuses for user Email Confirmation
export enum EmailConfirmationStatusesTitles {
  Pending = 'Очікує підтвердження ел. пошти',
  Confirmed = 'Ел. пошта підтверджена',
}

// Statuses for user Email Confirmation
export enum UserStatusesTitles {
  NeverLogged = 'Очікує логування',
  Accepted = 'Підтверджений',
  Blocked = 'Заблокований',
}

export enum ProviderStatusTitles {
  Approved = 'Заклад підтверджено',
  Pending = 'Очікує підтвердження',
  Editing = 'Потребує редагування'
}

export enum LicenseStatusTitles {
  Approved = 'Ліцензію підтверджено',
  Pending = 'Очікує підтвердження ліцензії',
  NotProvided = 'Ліцензію не надано'
}

export enum ProviderStatusDetails {
  Approved = 'Ваш заклад підтверджено адміністратором. Тепер ваш заклад буде видно іншим користувачам платформи і ви зможете редагувати інформацію про заклад.',
  Pending = 'Ваш заклад очікує підтвердження адміністратором.'
}

export enum StatusTitlesReverse {
  'Усі' = 'All',
  'Очікує підтвердження' = 'Pending',
  'Прийнято до конкурсного відбору' = 'AcceptedForSelection',
  'Навчається 1-11 років' = 'StudyingForYears',
  'Зараховано' = 'Approved',
  'Відмовлено' = 'Rejected',
  'Гурток залишено' = 'Left',
  'Користувач завершив навчання' = 'Completed',
  'Заблоковано' = 'Blocked',
  'Очікує логування' = 'NeverLogged',
  'Підтвердженно' = 'Accepted'
}

export enum UserStatusIcons {
  NeverLogged = 'fas fa-user-clock',
  Pending = 'fas fa-user-clock',
  Accepted = 'fas fa-user-check',
  Approved = 'fas fa-user-check',
  Confrimed = 'fas fa-user-check',
  Blocked = 'fas fa-user-times',
  Editing = 'fas fa-user-edit'
}
