import { SectionItem } from './section-item.model';

export class CompanyInformation {
  id?: string;
  title?: string;
  companyInformationItems: CompanyInformationSectionItem[];

  constructor(title: string, portalItems: CompanyInformationSectionItem[], id?) {
    this.id = id;
    this.title = title;
    this.companyInformationItems = portalItems;
  }
}

export class CompanyInformationSectionItem extends SectionItem {
  companyInformationId?: string;

  constructor(info) {
    super(info);

    if (info.companyInformationId) {
      this.companyInformationId = info.companyInformationId;
    }
  }
}

export interface PlatformInfoStateModel {
  AboutPortal: CompanyInformation;
  SupportInformation: CompanyInformation;
  LawsAndRegulations: CompanyInformation;
}
