import { CompetitionCoverage, CompetitionStatus, TypeOfCompetition } from 'shared/enum/Competition';
import { Direction } from 'shared/models/category.model';
import { Address } from 'shared/models/address.model';
import { Judge } from 'shared/models/judge.model';
import { FormOfLearning } from 'shared/enum/Competition';
import { Provider } from 'shared/models/provider.model';

export abstract class CompetitionBase {
  id?: string;
  providerId: string;
  childParticipant: string;
  termsOfParticipation: string;
  title: string;
  shortTitle: string;
  phone: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  startDate: Date;
  endDate: Date;
  regStartDate?: Date;
  regEndDate?: Date;
  typeOfCompetition: TypeOfCompetition;
  parentCompetition?: string;
  availableSeats: number;
  category?: Direction;
  subcategory?: string;
  description?: string;
  coverage?: CompetitionCoverage;
  formOfLearning?: FormOfLearning;
  disabilities?: boolean;
  disabilityOptionsDesc?: string;
  additionalDescription?: string;
  minAge?: number;
  maxAge?: number;
  competitiveSelection?: boolean;
  selectionOptionsDesc?: string;
  price?: number;
  benefits: boolean;
  benefitsOptionsDesc?: string;
  address: Address;
  chiefJudge: Judge;
  judges: Judge[];

  constructor(required: CompetitionRequired, description: Description, address: Address, judges: Judge[], provider: Provider, id?: string) {
    this.title = required.title;
    this.shortTitle = required.shortTitle;
    this.phone = required.phone;
    this.email = required.email;
    this.startDate = required.competitionDateRangeGroup.start;
    this.endDate = required.competitionDateRangeGroup.end;
    this.typeOfCompetition = required.typeOfCompetition;
    this.availableSeats = required.availableSeats;
    this.address = address;
    this.chiefJudge = judges[0];
    this.judges = judges.slice(1);
    this.providerId = provider.id;

    this.disabilities = Boolean(description.disabilityOptionsDesc);
    this.competitiveSelection = Boolean(description.selectionOptionsDesc);
    this.benefits = Boolean(description.benefitsOptionsDesc);

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
      this.regStartDate = required.registrationDateRangeGroup.start;
    }
    if (required.registrationDateRangeGroup.end) {
      this.regEndDate = required.registrationDateRangeGroup.end;
    }
    if (required.parentCompetition) {
      this.parentCompetition = required.parentCompetition;
    }
    if (description.category) {
      this.category = description.category;
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
      this.formOfLearning = description.formOfLearning;
    }
    if (description.disabilityOptionsDesc) {
      this.disabilityOptionsDesc = description.disabilityOptionsDesc;
    }
    if (description.additionalDescription) {
      this.additionalDescription = description.additionalDescription;
    }
    if (description.minAge) {
      this.minAge = description.minAge;
    }
    if (description.maxAge) {
      this.maxAge = description.maxAge;
    }
    if (description.selectionOptionsDesc) {
      this.selectionOptionsDesc = description.selectionOptionsDesc;
    }
    if (description.price) {
      this.price = description.price;
    }
    if (description.benefitsOptionsDesc) {
      this.benefitsOptionsDesc = description.benefitsOptionsDesc;
    }
  }
}

export class Competition extends CompetitionBase {
  takenSeats: number;
  rating: number;
  numberOfRatings: number;
  status: CompetitionStatus;
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
  availableSeats: number;
  coverImageId?: string;
  coverImage?: File;
}

interface Description {
  category?: Direction;
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
}
