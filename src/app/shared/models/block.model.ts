export class BlockedParent {
  parentId: string;
  providerId: string;
  reason?: string;
  userIdBlock?: string;
  userIdUnblock?: string;
  dateTimeFrom?: string;
  dateTimeTo?: string;

  constructor(parentId: string, providerId: string, reason?: string) {
    this.parentId = parentId;
    this.providerId = providerId;
    this.reason = reason;
  }
}

export interface EmployeeBlockData {
  userId: string;
  providerId: string;
  isBlocked?: boolean;
}
