import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient) { }

  /**
   * This method get image by image id
   * @param id: string
   */
  getImageByImageId(id: string): any {
    return this.http.get<any>(`/api/v1/PublicImage/${id}`);
  }
}
