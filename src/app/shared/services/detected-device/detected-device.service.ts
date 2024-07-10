import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetectedDeviceService {
  private isMobile = false;

  constructor() {}

  public checkedDevice(): boolean {
    if (
      // eslint-disable-next-line max-len
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      )
    ) {
      this.isMobile = true;
    }
    return this.isMobile;
  }
}
