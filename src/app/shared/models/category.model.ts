export interface Category {
  id: number;
  title: string;
  picture: string;
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
