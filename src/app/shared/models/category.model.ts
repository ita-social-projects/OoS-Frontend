export interface Category {
  id: number;
  title: string;
  description: string;
}
export interface Subcategory {
  id: number;
  categoryId: number;
  title: string;
  description: string;
}

export interface Subsubcategory {
  id: number;
  title: string;
  description: string;
  subcategoryId: number;
}
