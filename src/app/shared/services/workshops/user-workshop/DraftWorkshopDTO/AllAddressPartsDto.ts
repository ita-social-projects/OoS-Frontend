import { CodeficatorDto } from './CodeficatorDto';

export interface AllAddressPartsDto {
  id: number;
  category?: string;
  region?: string;
  district?: string;
  territorialCommunity?: string;
  settlement?: string;
  cityDistrict?: string;
  latitude?: number;
  longitude?: number;
  order?: number;
}
