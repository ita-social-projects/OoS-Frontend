import { CodeficatorCategories } from '../enum/codeficator-categories';

export interface Codeficator {
  id: number;
  category: CodeficatorCategories;
  territorialCommunity: string;
  settlement: string;
  cityDistrict: string;
  latitude: number;
  longitude: number;
  fullName: string;
  fullAddress?: string;
}

export interface CodeficatorCityDistrict {
  id: number;
  parentId: number;
  category: string;
  name: string;
}
