
export class DecodedImage {
  image: string;
  imgFile: File | null;

  constructor(image, imgFile) {
    this.image = image;
    this.imgFile = imgFile;
  }
}
