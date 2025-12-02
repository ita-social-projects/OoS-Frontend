export enum ApplicationIcons {
  Pending = 'fas fa-user-clock',
  AcceptedForSelection = 'fas fa-user-plus',
  Approved = 'fas fa-user-check',
  StudyingForYears = 'fas fa-user-check',
  Completed = 'fas fa-user-times',
  Rejected = 'fas fa-user-slash',
  Left = 'fas fa-user-slash',
  Blocked = 'fas fa-user-lock',
  Editing = 'fas fa-user-clock',
  Banned = 'fas fa-user-lock'
}

export enum ApplicationEntityType {
  provider = 'providers',
  workshop = 'workshops',
  ProviderDeputy = 'providerdeputies',
  Employee = 'employees',
  parent = 'parents'
}

export enum ApplicationStatusTabParams {
  All,
  Pending,
  Approved,
  Rejected,
  Left,
  AcceptedForSelection,
  StudyingForYears,
  Completed,
  Blocked
}

export enum ApplicationShowParams {
  All = 'All',
  Blocked = 'Blocked',
  Unblocked = 'Unblocked'
}
