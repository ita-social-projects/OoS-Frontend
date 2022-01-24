export class AboutPortal {
  id: string;
  title: string;
  sectionName: string;
  description: string;

  constructor(info, id?) {
    this.id = id;
    this.title = info.title;
    this.sectionName = info.sectionName;
    this.description = info.description;
  }
}