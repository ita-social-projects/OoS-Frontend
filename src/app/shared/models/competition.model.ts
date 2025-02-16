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

  constructor(
    required: CompetitionRequired,
    description: Description,
    Contacts: CompetitionContacts[],
    judges: Judge[],
    provider: Provider,
    id?: string
  ) {
    this.title = required.title;
    this.shortTitle = required.shortTitle;
    this.scheduledStartTime = required.competitionDateRangeGroup.start;
    this.scheduledEndTime = required.competitionDateRangeGroup.end;
    this.typeOfCompetition = required.typeOfCompetition;
    this.numberOfSeats = required.numberOfSeats;
    this.judges = judges;
    this.organizerOfTheEventId = provider.id;
    this.contacts = Contacts;

    this.optionsForPeopleWithDisabilities = Boolean(description.disabilityOptionsDesc);
    this.competitiveSelection = Boolean(description.selectionOptionsDesc);
    this.areThereBenefits = Boolean(description.benefitsOptionsDesc);
    this.optionsForPeopleWithDisabilities = description.optionsForPeopleWithDisabilities;

    if (id) {
      this.id = id;
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
    if (required.minimumAge) {
      this.minimumAge = required.minimumAge;
    }
    if (required.maximumAge) {
      this.maximumAge = required.maximumAge;
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

  constructor(
    required: CompetitionRequired,
    description: Description,
    contacts: CompetitionContacts[],
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

export class CompetitionContacts {
  title: string;
  isDefault: boolean;
  address: Address;
  phones: CompetitionPhone[];
  emails: CompetitionEmail[];
  socialNetworks?: CompetitionSocialNetwork[];

  constructor(info: CompetitionContacts) {
    this.title = info.title;
    this.isDefault = info.isDefault;
    this.address = info.address;
    this.phones = info.phones;
    this.emails = info.emails;

    if (info.socialNetworks) {
      this.socialNetworks = info.socialNetworks;
    }
  }
}

interface Description {
  institutionHierarchyId?: string;
  subcategory?: string;
  description?: string;
  coverage?: CompetitionCoverage;
  formOfLearning?: FormOfLearning;
  disabilityOptionsDesc?: string;
  additionalDescription?: string;
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
  type: Socials;
  url: string;
}

enum Socials {
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  Website = 'Website'
}
