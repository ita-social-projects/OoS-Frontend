import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  /**
   * Transform the specified value
   * If the value is not specified, it is returned ''
   * If the size of the string is greater than the limit, it returns a substring of the desired size
   * If the size of the string is less than the limit, it returns the original string
   * @param value
   * @param size
   */
  transform(value: string, size: number = 10): string {
    if (!value) {
      return '';
    }
    const limit = size > 0 ? size : 10;
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
