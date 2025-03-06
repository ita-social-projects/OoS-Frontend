import { LanguageId } from 'shared/enum/language-list';
import { Provider } from './provider.model';
import { PaginationParameters } from './query-parameters.model';
import { LanguageListItem } from './language-list.model';

export class StudySubject {
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

  constructor(subjectModel: Partial<StudySubject>, provider: Provider, id?: string) {
    this.nameInUkrainian = subjectModel.nameInUkrainian;
    this.nameInInstructionLanguage = subjectModel.nameInInstructionLanguage;
    this.language = subjectModel.language;
    this.languageId = subjectModel.language.id;
    this.isLanguageUkrainian = subjectModel.language.id === LanguageId.Ukrainian;
    this.activeFrom = subjectModel.activeFrom || '';
    this.activeTo = subjectModel.activeTo || '';
    this.workshopId = subjectModel.workshopId || '';
    this.providerId = provider.id;
    if (id) {
      this.id = id;
    }
  }
}

export interface StudySubjectParameters extends PaginationParameters {
  providerId?: string;
  searchString?: string;
  currentPage?: number;
  dateFrom?: string;
  dateTo?: string;
}
