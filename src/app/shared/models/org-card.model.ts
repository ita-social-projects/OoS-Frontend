export interface orgCard {
  title: string;
  owner: string;
  city: string;
  ownership: string;
  price: number | boolean;
  rate: string; //temp
  ageFrom: number;
  ageTo: number;
  category: string[];
}

export interface activitiesCard {
  title: string;
  picture: string;
  participants: number;
  messages: number;
  isRecruiting: boolean;
}