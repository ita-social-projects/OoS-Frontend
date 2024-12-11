export interface CodeficatorDto {
  id: number;
  code: string;
  parentId: number;
  category: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
  parent: CodeficatorDto;
}
