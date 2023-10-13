export enum NotificationType {
  Application = 'Application',
  Chat = 'Chat',
  Workshop = 'Workshop',
  Provider = 'Provider'
}

export enum NotificationAction {
  create = 'Create',
  update = 'Update',
  delete = 'Delete',
  message = 'Message',
  Block = 'Block',
  Unblock = 'Unblock',
}

export enum NotificationDescriptionType {
  Short,
  Full
}

export enum DataTypes {
  LicenseStatus = 'LicenseStatus',
  Status = 'Status'
}