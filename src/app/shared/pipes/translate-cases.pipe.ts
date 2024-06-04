import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translateCases',
  pure: false
})
export class TranslateCasesPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public transform(count: number, enumTranslate: any): string {
    const countLastStr = count?.toString().slice(-1);
    const countNum = count?.toString() || '0';
    let translateKey: string;

    if (count === 0 || (count >= 11 && count <= 14)) {
      translateKey = enumTranslate[2];
    } else if (countLastStr === '1') {
      translateKey = enumTranslate[0];
    } else if (countLastStr === '2' || countLastStr === '3' || countLastStr === '4') {
      translateKey = enumTranslate[1];
    } else if (enumTranslate) {
      translateKey = enumTranslate[2];
    } else {
      return '';
    }
    const translation = this.translateService.instant(translateKey);

    return `${countNum} ${translation}`;
  }
}
