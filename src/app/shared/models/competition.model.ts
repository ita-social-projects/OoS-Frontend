import { CompetitionStatus, RegularityOfCompetition, TypeOfCompetition } from 'shared/enum/Competition';

export abstract class CompetitionBase {
  id?: string;
  title: string;
  shortTitle: string;
  startTime: string;
  endTime: string;
  availableSeats: number;
  typeOfEvent: TypeOfCompetition;
  providerId: string;
  regularity: RegularityOfCompetition;
  parentEvent?: Competition;
  building: string;
  chiefJudge: string;
  childParticipant: string;
  description: string;
  additionalDescription: string;
  descriptionOfEnrollmentProcedure: string;
  formatOfClasses: string;
  premises: string;
  termsOfParticipation: string;
  judges: string;
  participants: string;
  preferentialTerms: boolean;
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
}

// 1. required 2. contacts 3. other
