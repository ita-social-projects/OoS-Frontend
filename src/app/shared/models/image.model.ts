export class DecodedImage {
  image: string;
  id?: string;
  imgFile: File | null;

  constructor(image: string, imgFile: File | null) {
    this.image = image;
    this.imgFile = imgFile;
  }
}
