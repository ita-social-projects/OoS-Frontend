import { EntityType } from '../enum/role';
import { PaginationParameters } from './queryParameters.model';

export interface Rate {
  id?: number;
  rate: number;
  type: number;
  entityId: string;
  parentId: string;
  creationTime?: Date;
  lastName?: string;
  firstName?: string;
}

export interface RateParameters extends PaginationParameters {
  entityType: EntityType;
  entityId: string;
}
