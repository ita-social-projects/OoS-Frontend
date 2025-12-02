import { ImageFormat } from 'shared/enum/image-format';

export interface Cropper {
  croppedWidth: number;
  croppedHeight?: number;
  croppedFormat: ImageFormat.PNG | ImageFormat.JPEG;
  cropperMinWidth: number;
  cropperMaxWidth: number;
  cropperMinHeight?: number;
  cropperMaxHeight?: number;
  cropperAspectRatio: number;
  croppedQuality: number;
}
