import { Params } from '@angular/router';
export interface Navigation {
  name: string;
  path?: string;
  queryParams?: Params;
  isActive: boolean;
  disable: boolean;
}
