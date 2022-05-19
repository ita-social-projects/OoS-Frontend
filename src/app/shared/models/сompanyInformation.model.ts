export class CompanyInformation {
  id?: string;
  title?: string;
  companyInformationItems: СompanyInformationItem [];

  constructor(title: string, portalItems: СompanyInformationItem[], id?) {
    this.id = id;
    this.title = title;
    this.companyInformationItems = portalItems;
  }
}
export class СompanyInformationItem {
  id?: string;
  sectionName?: string;
  description: string;
  companyInformationId?: string;

  constructor(info, id?, companyInformationId?) {
    this.id = id;
    this.sectionName = info.sectionName;
    this.description = info.description;
    this.companyInformationId = companyInformationId;
  }
}