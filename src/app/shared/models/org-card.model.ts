export interface orgCard {
  id: number;
  title: string;
  owner: string;
  city: string;
  address: string;
  ownership: string;
  price: number | boolean;
  rate: string; // temp
  votes: string;
  ageFrom: number;
  ageTo: number;
  category: string[];
}
