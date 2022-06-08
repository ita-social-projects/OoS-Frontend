export class SectionItem {
  id?: string;
  sectionName?: string;
  description: string;
  providerId?: string;

  constructor(info, id?) {
    
    this.sectionName = info.sectionName;
    this.description = info.description;
    if(id){
      this.id = id;
    }
    if(info.providerId)
      this.providerId =  info.providerId;
    }
}