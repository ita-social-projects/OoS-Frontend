export interface Rate {
  id: number;
  rate: number;
  type: string;
  entityId: string;
  parentId: number;
}

export interface StarRate {
  value: number;
  selected: boolean
}