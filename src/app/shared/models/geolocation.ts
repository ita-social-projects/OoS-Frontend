import { Codeficator } from './codeficator.model';

export interface GeolocationPositionError {
  code: number;
  message: string;
}

export interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

export interface GeolocationCoordinates {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
}

export interface Geocoder {
  catottgId?: number;
  street?: string;
  buildingNumber?: string;
  lat?: number;
  lon?: number;
  isReverse?: boolean;
  codeficator?: Codeficator;
}
