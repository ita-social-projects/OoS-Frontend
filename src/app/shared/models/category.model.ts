import { PaginationParameters } from './query-parameters.model';

export class Direction {
  id: number;
  title: string;
  description: string;
  subdirections: Subdirection[];
  workshopsCount?: number;

  constructor(info: Direction) {
    if (info.id) {
      this.id = info.id;
    }
    this.title = info.title;
    this.description = info.description;
    this.workshopsCount = info.workshopsCount;
    this.subdirections = info.subdirections || [];
  }
}

export interface DirectionParameters extends PaginationParameters {
  searchString: string;
}

export interface Subdirection {
  id: number;
  title: string;
  description: string;
}

export interface SubdirectionsResponse {
  entities: Subdirection[];
  totalCount: number;
}

export interface DirectionNode {
  name: string;
  id: number;
  direction?: Direction;
  children?: DirectionNode[];
}

export interface DirectionFlatNode {
  expanded: boolean;
  name: string;
  id: number;
  level: number;
  fullData?: Direction;
}
