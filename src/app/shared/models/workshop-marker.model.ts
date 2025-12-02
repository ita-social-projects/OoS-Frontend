import * as Layer from 'leaflet';

export interface WorkshopMarker {
  marker: Layer.Marker;
  isSelected?: boolean;
}
