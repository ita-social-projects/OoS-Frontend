import { CompetitionCoverage, CompetitionStatus, FormOfLearning } from 'shared/enum/competition';
import { Address } from 'shared/models/address.model';
import { Judge } from 'shared/models/judge.model';
import { Provider } from 'shared/models/provider.model';
import { WorkshopDraftStatus } from 'shared/enum/workshop';
import { PaginationParameters } from './query-parameters.model';
import { SectionItem } from './section-item.model';
import { Contacts } from './workshop.model';

export abstract class CompetitionBase {
  id?: string;
  organizerOfTheEventId: string;
  childParticipant: string;
  termsOfParticipation: string;
  preferentialTermsOfParticipation: string;
  title: string;
  shortTitle: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  registrationStartTime?: string;
  registrationEndTime?: string;
  parentCompetition?: string;
  numberOfSeats: number;
  directionSubDirectionIds: { directionId: number; subDirectionId: number }[];
  subDirectionIds: number[];
  coverageId: number;
  plannedFormatOfClasses?: FormOfLearning;
  minimumAge?: number;
  maximumAge?: number;
  competitiveSelection?: boolean;
  price?: number;
  areThereBenefits: boolean;
  benefits?: string;
  judges: Judge[];
  competitiveEventDescriptionItems?: CompetitiveDescriptionItem[];
  contacts: Contacts[];
  parentId: string;
  buildingHoldingId: string;
  childParticipantId: string;
  competitiveEventAccountingTypeId: number;
  descriptionOfTheEnrollmentProcedure?: string;
  venueId?: string;
  venueName?: string;
  participantsOfTheEvent: string[];
  additionalDescription?: string;

  constructor(
    required: CompetitionRequired,
    description: Description,
    contacts: Contacts[],
    judges: Judge[],
    provider: Provider,
    id?: string
  ) {
    this.title = required.title;
    this.shortTitle = required.shortTitle;
    this.scheduledStartTime = new Date(required.competitionDateRangeGroup.start).toISOString();
    this.scheduledEndTime = new Date(required.competitionDateRangeGroup.end).toISOString();
    this.competitiveEventAccountingTypeId = required.competitiveEventAccountingTypeId;
    this.numberOfSeats = required.numberOfSeats;
    this.judges = judges;
    this.organizerOfTheEventId = provider.id;
    this.contacts = contacts;
    this.coverageId = description.coverageId;

    this.competitiveSelection = Boolean(description.descriptionOfTheEnrollmentProcedure);
    this.areThereBenefits = Boolean(description.benefitsOptionsDesc);

    if (id) {
      this.id = id;
    }
    if (required.registrationDateRangeGroup.start) {
      this.registrationStartTime = new Date(required.registrationDateRangeGroup.start).toISOString();
    }
    if (required.registrationDateRangeGroup.end) {
      this.registrationEndTime = new Date(required.registrationDateRangeGroup.end).toISOString();
    }
    if (required.parentCompetition) {
      this.parentCompetition = required.parentCompetition;
    }
    if (required.minimumAge) {
      this.minimumAge = required.minimumAge;
    }
    if (required.maximumAge) {
      this.maximumAge = required.maximumAge;
    }
    if (description.subDirectionIds) {
      this.subDirectionIds = description.subDirectionIds;
    }
    if (description.formOfLearning) {
      this.plannedFormatOfClasses = description.formOfLearning;
    }

    if (description.additionalDescription) {
      this.additionalDescription = description.additionalDescription;
    }
    if (description.descriptionOfTheEnrollmentProcedure) {
      this.descriptionOfTheEnrollmentProcedure = description.descriptionOfTheEnrollmentProcedure;
    }
    if (description.venueName) {
      this.venueName = description.venueName;
    }
    if (description.termsOfParticipation) {
      this.termsOfParticipation = description.termsOfParticipation;
    }
    if (description.price) {
      this.price = description.price;
    }
    if (description.benefitsOptionsDesc) {
      this.benefits = description.benefitsOptionsDesc;
    }
    if (description.competitiveEventDescriptionItems) {
      this.competitiveEventDescriptionItems = description.competitiveEventDescriptionItems;
    }
  }
}

export class Competition extends CompetitionBase {
  numberOfOccupiedSeats: number;
  rating: number;
  numberOfRatings: number;
  state: CompetitionStatus;
  coverImageId?: string;
  coverImage?: File;
  imageIds?: string[];
  imageFiles?: File[];

  constructor(
    required: CompetitionRequired,
    description: Description,
    contacts: Contacts[],
    judges: Judge[],
    provider: Provider,
    id?: string
  ) {
    super(required, description, contacts, judges, provider, id);

    if (required.coverImageId) {
      this.coverImageId = required.coverImageId[0];
    }
    if (required.coverImage) {
      this.coverImage = required.coverImage;
    }
    if (description.imageIds) {
      this.imageIds = description.imageIds;
    }
    if (description.imageFiles) {
      this.imageFiles = description.imageFiles;
    }
  }
}

export class CompetitionDraft extends Competition {
  competitiveEventDraftId: string;
  draftStatus: WorkshopDraftStatus;
  rejectionMessage?: string;
  competitiveEventDetails: Competition;
  providerEdrpou: string;
  directorFullName: string;
  directorPosition: string;
}

export interface CompetitionRequired {
  title: string;
  shortTitle: string;
  phone: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  competitionDateRangeGroup: { start: Date; end: Date };
  registrationDateRangeGroup?: { start: Date; end: Date };
  competitiveEventAccountingTypeId: number;
  parentCompetition?: string;
  numberOfSeats: number;
  coverImageId?: string;
  coverImage?: File;
  minimumAge: number;
  maximumAge: number;
}

export interface CompetitionBaseCard {
  id: string;
  title: string;
  plannedFormatOfClasses: FormOfLearning;
  institutionHierarchy: string;
  institutionHierarchyId: string;
  coverImageId?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  minimumAge: number;
  maximumAge: number;
  competitiveSelection: boolean;
  price: number;
  address?: Address;
  rating: number;
  numberOfRatings: number;
  _meta?: string;
}

export interface CompetitionProviderViewCard extends CompetitionBaseCard {
  numberOfSeats: number;
  numberOfOccupiedSeats: number;
  amountOfPendingApplications: number;
  state: CompetitionStatus;
  unreadMessages: number;
}

export interface CompetitionCardParameters extends PaginationParameters {
  providerId: string;
  searchText?: string;
}

export class CompetitiveDescriptionItem extends SectionItem {
  competitiveEventId?: string;

  constructor(info: { id?: string; sectionName: string; description: string; competitiveEventId?: string }) {
    super(info);

    if (info.competitiveEventId) {
      this.competitiveEventId = info.competitiveEventId;
    }
  }
}

export interface Description {
  directionId?: number;
  subDirectionIds: number[];
  coverageId: CompetitionCoverage;
  formOfLearning?: FormOfLearning;
  additionalDescription?: string;
  descriptionOfTheEnrollmentProcedure?: string;
  price?: number;
  benefitsOptionsDesc?: string;
  benefits?: string;
  venueName?: string;
  termsOfParticipation?: string;
  preferentialTermsOfParticipation?: string;
  competitiveEventDescriptionItems?: CompetitiveDescriptionItem[];
  imageIds?: string[];
  imageFiles?: File[];
}

export interface CompetitionDraftCard extends CompetitionBaseCard {
  competitiveEventDraftId: string;
  draftStatus: WorkshopDraftStatus;
  rejectionMessage?: string;
  coverImageId?: string;
}

export interface CompetitionFilterAdministration extends PaginationParameters {
  searchString?: string;
  institutionId?: string;
  competitiveEventDraftStatuses?: string;
  catottgId?: number;
}

export class EditCompetitionDraft {
  title: string;
  shortTitle: string;
  descriptionOfTheEnrollmentProcedure?: string;
  additionalDescription?: string;
  venueName?: string;
  termsOfParticipation?: string;
  preferentialTermsOfParticipation?: string;
  benefits?: string;
}
