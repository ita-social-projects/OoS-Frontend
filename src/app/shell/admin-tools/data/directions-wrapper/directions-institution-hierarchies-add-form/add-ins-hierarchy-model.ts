import { InstituitionHierarchy, Institution } from "shared/models/institution.model";

export interface AddInsHierarchyModel {
  columns: string[];
  allInsHierarchies: InstituitionHierarchy[];
  institution: Institution;
}