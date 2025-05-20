import { Provider } from './provider.model';
import { PaginationParameters } from './query-parameters.model';

export class Position {
  id?: string;
  language: string;
  description: string;
  isForRuralAreas?: boolean;
  department: string;
  seatsAmount: number;
  fullName: string;
  shortName: string;
  genitiveName: string;
  isTeachingPosition?: boolean;
  rate: number;
  tariff: number;
  classifierType: string;
  providerId: string;
  contactId?: string;
  createdAt?: string;

  constructor(position: Partial<Position>, provider: Provider, id?: string) {
    this.language = position.language;
    this.description = position.description;
    this.isForRuralAreas = position.isForRuralAreas ?? false;
    this.department = position.department;
    this.providerId = provider.id;
    this.contactId = position.contactId || '';
    this.seatsAmount = position.seatsAmount;
    this.fullName = position.fullName;
    this.shortName = position.shortName;
    this.genitiveName = position.genitiveName;
    this.isTeachingPosition = position.isTeachingPosition ?? false;
    this.rate = position.rate;
    this.tariff = position.tariff;
    this.classifierType = position.classifierType;
    this.createdAt = position.createdAt || '';
    if (id) {
      this.id = id;
    }
  }
}

export interface PositionParameters extends PaginationParameters {
  providerId?: string;
  searchString?: string;
  currentPage?: number;
  OrderByFullName?: boolean;
  OrderByCreatedAt?: boolean;
}
