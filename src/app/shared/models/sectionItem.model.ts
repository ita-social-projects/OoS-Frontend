export class SectionItem {
  id?: string;
  sectionName?: string;
  description: string;

  constructor(info, id?) {
    this.sectionName = info.sectionName;
    this.description = info.description;
    if (id) {
      this.id = id;
    }
  }
}

export class СompanyInformationSectionItem extends SectionItem {
  companyInformationId?: string;

  constructor(info, id?) {
    super(info, id);

    if(info.companyInformationId)
      this.companyInformationId =  info.companyInformationId;
    }
}
