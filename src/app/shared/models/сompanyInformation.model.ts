import { SectionItem } from "./sectionItem.model";

export class CompanyInformation {
  id?: string;
  title?: string;
  companyInformationItems: СompanyInformationSectionItem [];

  constructor(title: string, portalItems: СompanyInformationSectionItem[], id?) {
    this.id = id;
    this.title = title;
    this.companyInformationItems = portalItems;
  }
}

export class СompanyInformationSectionItem extends SectionItem {
  companyInformationId?: string;

  constructor(info) {
    super(info);

    if(info.companyInformationId)
      this.companyInformationId =  info.companyInformationId;
    }
}

export interface PlatformInfoStateModel {
  AboutPortal: CompanyInformation;
  SupportInformation: CompanyInformation;
  LawsAndRegulations: CompanyInformation;
}