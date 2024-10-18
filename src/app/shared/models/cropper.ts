export interface Cropper {
  croppedWidth: number;
  croppedHeight?: number;
  croppedFormat: 'png' | 'jpeg';
  cropperMinWidth: number;
  cropperMaxWidth: number;
  cropperMinHeight?: number;
  cropperMaxHeight?: number;
  cropperAspectRatio: number;
  croppedQuality: number;
}
