import { NgControl } from '@angular/forms';
import { TrimValueDirective } from './trim-value.directive';

const elRefMock = { nativeElement: document.createElement('input') };
const ngControl = {} as NgControl;
describe('TrimValueDirective', () => {
  it('should create an instance', () => {
    const directive = new TrimValueDirective(ngControl, elRefMock);
    expect(directive).toBeTruthy();
  });
});
