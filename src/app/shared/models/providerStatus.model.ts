import { Statuses } from '../enum/statuses';

export interface ProviderStatus {
  status: Statuses;
  statusReason: string;
}
