export interface Cropper {
  croppedWidth: number;
  croppedHeight?: number;
  croppedFormat: string;
  cropperMinWidth: number;
  cropperMaxWidth: number;
  cropperMinHeight?: number;
  cropperMaxHeight?: number;
  cropperAspectRatio: number;
}