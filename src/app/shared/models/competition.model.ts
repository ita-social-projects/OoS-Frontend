import { CompetitionCoverage, CompetitionStatus, TypeOfCompetition, FormOfLearning } from 'shared/enum/competition';
import { Direction } from 'shared/models/category.model';
import { Address } from 'shared/models/address.model';
import { Judge } from 'shared/models/judge.model';
import { Provider } from 'shared/models/provider.model';
import { PaginationParameters } from './query-parameters.model';
import { SectionItem } from './section-item.model';

export abstract class CompetitionBase {
  id?: string;
  organizerOfTheEventId: string;
  childParticipant: string;
  termsOfParticipation: string;
  preferentialTermsOfParticipation: string;
  title: string;
  shortTitle: string;
  phone: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  registrationStartTime?: Date;
  registrationEndTime?: Date;
  typeOfCompetition: TypeOfCompetition;
  parentCompetition?: string;
  numberOfSeats: number;
  institutionHierarchyId?: string;
  subcategory?: string;
  description?: string;
  coverage?: CompetitionCoverage;
  plannedFormatOfClasses?: FormOfLearning;
  optionsForPeopleWithDisabilities?: boolean;
  disabilityOptionsDesc?: string;
  descriptionOfOptionsForPeopleWithDisabilities?: string;
  minimumAge?: number;
  maximumAge?: number;
  competitiveSelection?: boolean;
  selectionOptionsDesc?: string;
  price?: number;
  areThereBenefits: boolean;
  benefits?: string;
  address: Address;
  judges: Judge[];
  directionIds: number[];
  competitiveEventDescriptionItems?: CompetitiveDescriptionItem[];
  contacts: CompetitionContacts[];
  parentId: string;
  buildingHoldingId: string;
  childParticipantId: string;
  competitiveEventAccountingTypeId: number;
  descriptionOfTheEnrollmentProcedure: string;
  venueId?: string;
  venueName?: string;
  participantsOfTheEvent: string[];

  constructor(required: CompetitionRequired, description: Description, address: Address, judges: Judge[], provider: Provider, id?: string) {
    this.title = required.title;
    this.shortTitle = required.shortTitle;
    this.phone = required.phone;
    this.email = required.email;
    this.scheduledStartTime = required.competitionDateRangeGroup.start;
    this.scheduledEndTime = required.competitionDateRangeGroup.end;
    this.typeOfCompetition = required.typeOfCompetition;
    this.numberOfSeats = required.numberOfSeats;
    this.address = address;
    this.judges = judges;
    this.organizerOfTheEventId = provider.id;

    this.optionsForPeopleWithDisabilities = Boolean(description.disabilityOptionsDesc);
    this.competitiveSelection = Boolean(description.selectionOptionsDesc);
    this.areThereBenefits = Boolean(description.benefitsOptionsDesc);
    this.optionsForPeopleWithDisabilities = description.optionsForPeopleWithDisabilities;

    if (id) {
      this.id = id;
    }
    if (required.facebook) {
      this.facebook = required.facebook;
    }
    if (required.website) {
      this.website = required.website;
    }
    if (required.instagram) {
      this.instagram = required.instagram;
    }
    if (required.registrationDateRangeGroup.start) {
      this.registrationStartTime = required.registrationDateRangeGroup.start;
    }
    if (required.registrationDateRangeGroup.end) {
      this.registrationEndTime = required.registrationDateRangeGroup.end;
    }
    if (required.parentCompetition) {
      this.parentCompetition = required.parentCompetition;
    }
    if (description.institutionHierarchyId) {
      this.institutionHierarchyId = description.institutionHierarchyId;
    }
    if (description.subcategory) {
      this.subcategory = description.subcategory;
    }
    if (description.description) {
      this.description = description.description;
    }
    if (description.coverage) {
      this.coverage = description.coverage;
    }
    if (description.formOfLearning) {
      this.plannedFormatOfClasses = description.formOfLearning;
    }
    if (description.disabilityOptionsDesc) {
      this.disabilityOptionsDesc = description.disabilityOptionsDesc;
    }
    if (description.additionalDescription) {
      this.descriptionOfOptionsForPeopleWithDisabilities = description.additionalDescription;
    }
    if (description.minAge) {
      this.minimumAge = description.minAge;
    }
    if (description.maxAge) {
      this.maximumAge = description.maxAge;
    }
    if (description.selectionOptionsDesc) {
      this.selectionOptionsDesc = description.selectionOptionsDesc;
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
  takenSeats: number;
  rating: number;
  numberOfRatings: number;
  state: CompetitionStatus;
  coverImageId?: string;
  coverImage?: File;
  imageIds?: string[];
  imageFiles?: File[];

  constructor(required: CompetitionRequired, description: Description, address: Address, judges: Judge[], provider: Provider, id?: string) {
    super(required, description, address, judges, provider, id);

    if (required.coverImageId) {
      this.coverImageId = required.coverImageId[0];
    }
    if (required.coverImage) {
      this.coverImage = required.coverImage;
    }
  }
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
  typeOfCompetition: TypeOfCompetition;
  parentCompetition?: string;
  numberOfSeats: number;
  coverImageId?: string;
  coverImage?: File;
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
  withDisabilityOptions: boolean;
  rating: number;
  numberOfRatings: number;
  directionIds: number[];
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
}

export class CompetitiveDescriptionItem extends SectionItem {
  competitionId?: string;

  constructor(info: { id?: string; sectionName: string; description: string; competitionId?: string }) {
    super(info);

    if (info.competitionId) {
      this.competitionId = info.competitionId;
    }
  }
}

interface CompetitionContacts {
  title: string;
  isDefault: boolean;
  address: Address;
  phones: CompetitionPhone[];
  emails: CompetitionEmail[];
  socialNetworks: CompetitionSocialNetwork[];
}

interface Description {
  institutionHierarchyId?: string;
  subcategory?: string;
  description?: string;
  coverage?: CompetitionCoverage;
  formOfLearning?: FormOfLearning;
  disabilityOptionsDesc?: string;
  additionalDescription?: string;
  minAge?: number;
  maxAge?: number;
  selectionOptionsDesc?: string;
  price?: number;
  benefitsOptionsDesc?: string;
  competitiveEventDescriptionItems?: CompetitiveDescriptionItem[];
  optionsForPeopleWithDisabilities: boolean;
}

interface CompetitionPhone {
  type: string;
  number: string;
}

interface CompetitionEmail {
  type: string;
  address: string;
}

interface CompetitionSocialNetwork {
  type: string;
  url: string;
}
