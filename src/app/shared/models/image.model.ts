export class DecodedImage {
  image: string;
  id?: string;
  imgFile: File | null;
  isBroken?: boolean = false;

  constructor(image: string, imgFile: File | null) {
    this.image = image;
    this.imgFile = imgFile;
  }
}
