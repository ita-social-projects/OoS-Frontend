// Statuses for Provider Lisence Review
export enum LicenseStatuses {
  NotProvided = 'NotProvided',
  Pending = 'Pending',
  Approved = 'Approved'
}

// Statuses for Provider Data Review
export enum ProviderStatuses {
  Approved = 'Approved',
  Pending = 'Pending',
  Editing = 'Editing',
  Blocked = 'Blocked',
  Recheck = 'Recheck'
}

// Statuses for Ministry Admin Logging
export enum UserStatuses {
  NeverLogged = 'NeverLogged',
  Accepted = 'Accepted',
  Blocked = 'Blocked'
}

// Statuses for Provider Applications
export enum ApplicationProviderStatuses {
  Pending = 'Pending',
  AcceptedForSelection = 'AcceptedForSelection',
  Approved = 'Approved',
  StudyingForYears = 'StudyingForYears',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Left = 'Left',
  Banned = 'Banned'
}

// Statuses for Applications
export enum ApplicationStatuses {
  Pending = 'Pending',
  AcceptedForSelection = 'AcceptedForSelection',
  Approved = 'Approved',
  StudyingForYears = 'StudyingForYears',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Left = 'Left'
}

// Statuses for user Email Confirmation
export enum EmailConfirmationStatuses {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  NotConfirmed = 'NotConfirmed'
}

export enum UserStatusIcons {
  NeverLogged = 'fas fa-user-clock',
  Pending = 'fas fa-user-clock',
  Accepted = 'fas fa-user-check',
  Approved = 'fas fa-user-check',
  Confrimed = 'fas fa-user-check',
  Blocked = 'fas fa-user-times',
  Editing = 'fas fa-user-edit',
  Recheck = 'fas fa-user-edit'
}
