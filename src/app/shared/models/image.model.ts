
export class DecodedImage {
  image: string;
  isUpdate: boolean

  constructor(image, isUpdate) {
    this.image = image;
    this.isUpdate = isUpdate;
  }
}