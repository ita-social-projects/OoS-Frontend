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

export interface BaseGeocoder {
  catottgId?: number;
  street?: string;
  buildingNumber?: string;
  latitude?: number;
  longitude?: number;
  isReverse?: boolean;
}
export interface Geocoder extends BaseGeocoder {
  latitude?: number;
  longitude?: number;
}

export interface GeocoderDTO extends BaseGeocoder {
  lat: number;
  lon: number;
}
