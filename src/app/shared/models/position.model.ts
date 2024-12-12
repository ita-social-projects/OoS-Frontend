import { PaginationParameters } from './query-parameters.model';

export class Position {
  languages?: string[];
  description?: string;
  forRuralAres?: boolean;
  openedInDepartment?: string;
  provider?: string;
  contactInformation?: string[];
  numOfSeats: number;
  fullName: string;
  shortName?: string;
  nameInGenitiveCase: string;
  teachingPosition?: boolean;
  rate: number;
  tariff: number;
  typeByClassifier: string;
  id: string;

  constructor(position: Partial<Position>) {
    this.languages = position.languages || [];
    this.description = position.description || '';
    this.forRuralAres = position.forRuralAres ?? false;
    this.openedInDepartment = position.openedInDepartment || '';
    this.provider = position.provider || '';
    this.contactInformation = position.contactInformation || [];
    this.numOfSeats = position.numOfSeats;
    this.fullName = position.fullName;
    this.shortName = position.shortName || '';
    this.nameInGenitiveCase = position.nameInGenitiveCase;
    this.teachingPosition = position.teachingPosition ?? false;
    this.rate = position.rate ?? 0;
    this.tariff = position.tariff ?? 0;
    this.typeByClassifier = position.typeByClassifier || '';
    this.id = position.id;
  }
}

export interface PositionParameters extends PaginationParameters {
  providerId?: string;
  searchQuery?: string;
  currentPage?: number;
}
