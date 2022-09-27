export class RequestParams{
  id: string;
  isParent: boolean;

  constructor(id: string, isParent: boolean){
    this.id = id;
    this.isParent = isParent;
  }
}

export interface Truncated{
  id: string,
  title: string,
}