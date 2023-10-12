import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { TranslateService as NgxTranslateService } from '@ngx-translate/core';

@Injectable()
@Pipe({
  name: 'translateCases',
  pure: false
})
export class TranslateCasesPipe implements PipeTransform {
  translateKey: string;
  private translation: any;
  private _translateService: any;

  constructor(translateService: NgxTranslateService) {
    this._translateService = translateService;
  }

  transform(count: number, enumTranslate: any): string {
    const countLastStr = count?.toString().slice(-1);
    let countNum = count?.toString() || '0';

    if (count === 0 || (count >= 11 && count <= 14)) {
      this.translateKey = enumTranslate[2];
    } else if (countLastStr === '1') {
      this.translateKey = enumTranslate[0];
    } else if (countLastStr === '2' || countLastStr === '3' || countLastStr === '4') {
      this.translateKey = enumTranslate[1];
    } else if (enumTranslate) {
      this.translateKey = enumTranslate[2];
    } else {
      return '';
    }

    this.translation = this._translateService.instant(this.translateKey);

    return `${countNum} ${this.translation}`;
  }
}
