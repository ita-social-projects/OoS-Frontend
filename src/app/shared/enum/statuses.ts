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
}

// Statuses for user Email Confirmation
export enum EmailConfirmationStatuses {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
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

export enum UserStatusIcons {
  NeverLogged = 'fas fa-user-clock',
  Pending = 'fas fa-user-clock',
  Accepted = 'fas fa-user-check',
  Approved = 'fas fa-user-check',
  Confrimed = 'fas fa-user-check',
  Blocked = 'fas fa-user-times',
  Editing = 'fas fa-user-edit'
}
