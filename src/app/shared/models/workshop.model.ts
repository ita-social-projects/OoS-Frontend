import { OwnershipTypes } from 'shared/enum/provider';
import { LicenseStatuses, ProviderStatuses } from 'shared/enum/statuses';
import { FormOfLearning, PayRateType, WorkshopDraftStatus, WorkshopOpenStatus } from 'shared/enum/workshop';
import { DateTimeRanges } from 'shared/models/working-hours.model';
import { StudyPeriodDates } from 'shared/models/study-period-dates.model';
import { Address } from './address.model';
import { Provider } from './provider.model';
import { PaginationParameters } from './query-parameters.model';
import { SectionItem } from './section-item.model';
import { Teacher } from './teacher.model';

export abstract class WorkshopBase {
  id?: string;
  title: string;
  shortTitle: string;
  noAgeRestrictions: boolean;
  minAge?: number;
  maxAge?: number;
  studyPeriodDates: StudyPeriodDates;
  dateTimeRanges: DateTimeRanges[];
  isPaid: boolean;
  price: number | string;
  payRate: PayRateType;
  formOfLearning: FormOfLearning;
  availableSeats: number;
  competitiveSelection: boolean;
  competitiveSelectionDescription: string;
  workshopDescriptionItems: WorkshopDescriptionItem[];
  languageOfEducationId: number;
  languageOfEducationName: string;
  institutionId: string;
  institution: string;
  institutionHierarchyId: string;
  institutionHierarchy: string;
  isChampionPath?: boolean = false;
  directionIds: number[];
  keywords: string[];
  contacts: Contacts[];
  teachers: Teacher[];
  providerId: string;
  providerTitle: string;
  providerLicenseStatus: LicenseStatuses;
  tagIds: number[];
  isSelfFinanced: boolean;
  enrollmentProcedureDescription: string;
  isInclusive: boolean;
  specialNeedsType: string;
  areThereBenefits: boolean;
  preferentialTermsOfParticipation: string;
  educationalShift: string;
  ageComposition: string;
  coverage: string;
  workshopType: string;
  base64CoverImage?: string;
  base64ImageFiles?: string[];

  constructor(
    about: WorkshopAbout,
    description: Description,
    workshopContacts: Contacts[],
    additionalAbout: AdditionalAbout,
    teachers: Teacher[],
    provider: Provider,
    id?: string
  ) {
    this.title = about?.title;
    this.shortTitle = about?.shortTitle;
    this.noAgeRestrictions = about?.noAgeRestrictions;
    this.minAge = about?.minAge;
    this.maxAge = about?.maxAge;
    this.dateTimeRanges = about?.dateTimeRanges;
    this.studyPeriodDates = about?.studyPeriodDates;
    this.languageOfEducationId = about?.languageOfEducationId;
    this.formOfLearning = about?.formOfLearning;
    this.availableSeats = about?.availableSeats;
    this.workshopDescriptionItems = description?.workshopDescriptionItems;
    this.institutionId = additionalAbout?.institutionId;
    this.institutionHierarchyId = additionalAbout?.institutionHierarchyId;
    this.isChampionPath = additionalAbout?.isChampionPath;
    this.keywords = description?.keyWords;
    this.competitiveSelection = description?.competitiveSelection;
    this.competitiveSelectionDescription = description?.competitiveSelectionDescription;
    this.teachers = teachers;
    this.providerId = provider?.id;
    this.providerTitle = provider?.fullTitle;
    this.tagIds = description?.tagIds;
    this.isSelfFinanced = additionalAbout?.isSelfFinanced;
    this.enrollmentProcedureDescription = description?.enrollmentProcedureDescription;
    this.isInclusive = additionalAbout?.isInclusive;
    this.specialNeedsType = additionalAbout?.specialNeedsType;
    this.areThereBenefits = additionalAbout?.areThereBenefits;
    this.preferentialTermsOfParticipation = additionalAbout?.preferentialTermsOfParticipation;
    this.educationalShift = additionalAbout?.educationalShift;
    this.ageComposition = additionalAbout?.ageComposition;
    this.workshopType = additionalAbout?.workshopType;
    this.isPaid = additionalAbout?.isPaid;
    this.price = additionalAbout?.price;
    this.payRate = additionalAbout?.payRate;
    this.coverage = description?.coverage;
    this.contacts = workshopContacts;

    if (id) {
      this.id = id;
    }
  }
}

export class Workshop extends WorkshopBase {
  takenSeats: number;
  rating: number;
  numberOfRatings: number;
  status: WorkshopOpenStatus;
  isBlocked: boolean;
  providerOwnership: OwnershipTypes;
  providerStatus: ProviderStatuses;
  coverImageId?: string;
  coverImage?: File;
  imageIds?: string[];
  imageFiles?: File[];

  constructor(
    about?: WorkshopAbout,
    description?: Description,
    workshopContacts?: Contacts[],
    additionalAbout?: AdditionalAbout,
    teachers?: Teacher[],
    provider?: Provider,
    id?: string
  ) {
    super(about, description, workshopContacts, additionalAbout, teachers, provider, id);

    if (about?.coverImageId) {
      this.coverImageId = about.coverImageId[0];
    }
    if (about?.coverImage) {
      this.coverImage = about?.coverImage;
    }
    if (description?.imageIds?.length) {
      this.imageIds = description.imageIds;
    }
    if (description?.imageFiles?.length) {
      this.imageFiles = description.imageFiles;
    }
  }
}

export class WorkshopDraft extends Workshop {
  workshopDraftId: string;
  rejectionMessage?: string;
  draftStatus: WorkshopDraftStatus;
  workshopDetails: Workshop;
  providerEdrpou: string;
  directorFullName: string;
  directorPosition: string;
}

export interface WorkshopTruncated {
  id?: string;
  title: string;
  providerTitle?: string;
  providerId: string;
}

export class WorkshopDescriptionItem extends SectionItem {
  workshopId?: string;

  constructor(info: { id?: string; sectionName: string; description: string; workshopId?: string }) {
    super(info);

    if (info.workshopId) {
      this.workshopId = info.workshopId;
    }
  }
}

export interface WorkshopBaseCard {
  id: string;
  providerTitle: string;
  providerOwnership: OwnershipTypes;
  title: string;
  payRate: PayRateType;
  formOfLearning: FormOfLearning;
  coverImageId?: string;
  minAge: number;
  maxAge: number;
  competitiveSelection: boolean;
  price: number;
  directionIds: number[];
  providerId: string;
  address: Address;
  rating: number;
  numberOfRatings: number;
  providerLicenseStatus: LicenseStatuses;
  isSelfFinanced: boolean;
  enrollmentProcedureDescription: string;
  isInclusive: boolean;
  _meta?: string;
}

export interface WorkshopCard extends WorkshopBaseCard {
  institutionHierarchyId: string;
  institutionId: string;
  institution: string;
  availableSeats: number;
  takenSeats: number;
  amountOfPendingApplications: number;
  status: WorkshopOpenStatus;
  languageOfEducationName: string;
}

export interface WorkshopDraftCard extends WorkshopBaseCard {
  workshopDraftId: string;
  rejectionMessage?: string;
  draftStatus: WorkshopDraftStatus;
}

export interface WorkshopProviderViewCard extends WorkshopBaseCard {
  availableSeats: number;
  takenSeats: number;
  amountOfPendingApplications: number;
  status: WorkshopOpenStatus;
  unreadMessages: number;
  id: string;
  draftStatus: string;
}

export interface WorkshopStatus {
  workshopId: string;
  statusReason?: string;
  status: string;
}

export interface WorkshopStatusWithTitle extends WorkshopStatus {
  title: string;
}

export interface WorkshopCardParameters extends PaginationParameters {
  providerId: string;
  searchText?: string;
}

export interface WorkshopAbout {
  title: string;
  shortTitle: string;
  noAgeRestrictions: boolean;
  minAge?: number;
  maxAge?: number;
  studyPeriodDates: StudyPeriodDates;
  dateTimeRanges: DateTimeRanges[];
  languageOfEducationId: number;
  formOfLearning: FormOfLearning;
  availableSeats: number;
  coverImageId?: string;
  coverImage?: File;
  base64CoverImage?: string;
}

export interface AdditionalAbout {
  isSelfFinanced: boolean;
  isInclusive: boolean;
  isPaid: boolean;
  specialNeedsType: string;
  educationalShift: string;
  ageComposition: string;
  workshopType: string;
  price: number;
  payRate: PayRateType;
  areThereBenefits: boolean;
  preferentialTermsOfParticipation: string;
  institutionId: string;
  institutionHierarchyId: string;
  isChampionPath?: boolean;
}

export interface WorkshopFilterAdministration extends PaginationParameters {
  searchString?: string;
  institutionId?: string;
  workshopDraftStatuses?: string;
  catottgId?: number;
}

export interface Description {
  workshopDescriptionItems: WorkshopDescriptionItem[];
  keyWords: string[];
  imageIds?: string[];
  imageFiles?: File[];
  tagIds: number[];
  enrollmentProcedureDescription: string;
  coverage: string;
  competitiveSelection: boolean;
  competitiveSelectionDescription: string;
}

export class Contacts {
  title: string;
  address: Address;
  phones: PhoneType[];
  emails: EmailType[];
  socialNetworks?: SocialNetworks[];
  isDefault: boolean;

  constructor(info: Contacts) {
    this.title = info.title;
    this.address = info.address;
    this.phones = info.phones;
    this.emails = info.emails;
    this.isDefault = info.isDefault;
    if (info.socialNetworks) {
      this.socialNetworks = info.socialNetworks;
    }
  }
}

export class EditWorkshopDraft {
  title: string;
  shortTitle: string;
  competitiveSelectionDescription?: string;
  preferentialTermsOfParticipation?: string;
  enrollmentProcedureDescription?: string;
  institutionHierarchyId: string;
  workshopDescriptionItems: WorkshopDescriptionItem[];
}

interface PhoneType {
  type: string;
  number: string;
}

interface EmailType {
  type: string;
  address: string;
}

interface SocialNetworks {
  type: Socials;
  url: string;
}

export enum Socials {
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  Website = 'Website'
}

export enum UnfinishedWorkshopType {
  WithMainProperties = 'withMainProperties',
  WithOtherRequiredProperties = 'withOtherRequiredProperties',
  WithDescription = 'withDescription',
  WithContacts = 'withContacts'
}

export type UnfinishedWorkshopAbout = WorkshopAbout & {
  $type?: UnfinishedWorkshopType.WithMainProperties;
  base64CoverImage: string;
  providerId?: string;
};

export type UnfinishedWorkshopAdditionalAbout = AdditionalAbout &
  UnfinishedWorkshopAbout & {
    $type?: UnfinishedWorkshopType.WithOtherRequiredProperties;
  };

export type UnfinishedWorkshopDescription = Description &
  UnfinishedWorkshopAdditionalAbout & {
    $type?: UnfinishedWorkshopType.WithDescription;
    base64ImageFiles: string[];
  };

export type UnfinishedWorkshopContacts = Contacts &
  UnfinishedWorkshopDescription & {
    $type?: UnfinishedWorkshopType.WithContacts;
  };

export interface WorkshopDraftState {
  step1?: UnfinishedWorkshopAbout;
  step2?: UnfinishedWorkshopAdditionalAbout;
  step3?: UnfinishedWorkshopDescription;
  step4?: UnfinishedWorkshopContacts;
  workshopForLoading?: Workshop;
}
