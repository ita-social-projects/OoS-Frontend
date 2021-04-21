import {Address} from './address.model';
import {Teacher} from './teacher.model';

export interface GetWorkshopModel {
  type: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  minAge: number;
  maxAge: number;
  daysPerWeek: number;
  photos: string;
  description: string;
  head: string;
  resources: string;
  direction: string;
  keyWords: string;
  price: number;
  address: Address;
  teachers: Teacher[];
}
