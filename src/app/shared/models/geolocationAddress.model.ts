
export interface GeolocationAddress {
  address: {
    city?: string;
    village?: string;
    town?: string;
    hamlet?: string;
    road?: string;
    house_number?: string;
  };
  lat?: string;
  lon?: string;
}


export interface MapAddress {
  settlement: string;
  street: string;
  buildingNumber: string;
  latitude?: number;
  longitude?: number;
}
