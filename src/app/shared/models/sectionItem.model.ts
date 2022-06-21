export class SectionItem {
  id?: string;
  sectionName?: string;
  description: string;

  constructor(info) {
    this.sectionName = info.sectionName;
    this.description = info.description;
    if (info.id) {
      this.id = info.id;
    }
  }
}
