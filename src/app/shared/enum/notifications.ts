export enum NotificationDescriptionType {
  Short = 'Short',
  Full = 'Full'
}

export enum NotificationType {
  Application = 'Application',
  Chat = 'Chat',
  Workshop = 'Workshop',
  Provider = 'Provider',
  System = 'System',
  Parent = 'Parent'
}

export enum NotificationAction {
  Unknown = 'Unknown',
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
  Message = 'Message',
  LicenseApproval = 'LicenseApproval',
  Block = 'Block',
  Unblock = 'Unblock',
  ProviderBlock = 'ProviderBlock',
  ProviderUnblock = 'ProviderUnblock'
}

export enum NotificationDataType {
  Status = 'Status',
  LicenseStatus = 'LicenseStatus',
  Title = 'Title',
  ProviderId = 'ProviderId',
  ProviderShortTitle = 'ProviderShortTitle',
  ProviderFullTitle = 'ProviderFullTitle'
}
