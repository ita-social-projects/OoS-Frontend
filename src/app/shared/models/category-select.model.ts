export interface CategorySelect {
  id: number;
  title: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: number;
  title: string;
  study: Study[];
}

interface Study {
  id: number;
  title: string;
}
