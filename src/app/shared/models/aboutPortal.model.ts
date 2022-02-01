export class AboutPortalItem {
  id?: string;
  sectionName?: string;
  description: string;
  aboutPortalId?: string;

  constructor(info, id?, aboutPortalId?) {
    this.id = id;
    this.sectionName = info.sectionName;
    this.description = info.description;
    this.aboutPortalId = aboutPortalId;
  }
}
export class AboutPortal {
  id?: string;
  title?: string;
  aboutPortalItems: AboutPortalItem [];

  constructor(title: string, portalItems: AboutPortalItem[], id?) {
    this.id = id;
    this.title = title;
    this.aboutPortalItems = portalItems;
  }
}