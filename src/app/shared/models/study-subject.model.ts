import { Provider } from './provider.model';
import { PaginationParameters } from './query-parameters.model';
import { LanguageListItem } from './language-list.model';

export class SubjectModel {
  id?: string;
  nameInUkrainian: string;
  nameInInstructionLanguage: string;
  isLanguageUkrainian: boolean;
  languageId: number;
  language: LanguageListItem;
  activeFrom: string;
  activeTo: string;
  workshopId: string;
  providerId: string;

  constructor(subjectModel: Partial<SubjectModel>, provider: Provider, id?: string) {
    this.nameInUkrainian = subjectModel.nameInUkrainian;
    this.nameInInstructionLanguage = subjectModel.nameInInstructionLanguage;
    this.language = subjectModel.language;
    this.languageId = subjectModel.language.id;
    this.isLanguageUkrainian = subjectModel.language.id === 2;
    this.activeFrom = subjectModel.activeFrom || '';
    this.activeTo = subjectModel.activeTo || '';
    this.workshopId = subjectModel.workshopId || '';
    this.providerId = provider.id;
    if (id) {
      this.id = id;
    }
  }
}

export interface SubjectParameters extends PaginationParameters {
  providerId?: string;
  searchString?: string;
  currentPage?: number;
  dateFrom?: string;
  dateTo?: string;
}
