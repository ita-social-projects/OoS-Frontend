import { DigitOnlyDirective } from './digit-only.directive';

const elRefMock = { nativeElement: document.createElement('input') };

describe('DigitOnlyDirective', () => {
  it('should create an instance', () => {
    const directive = new DigitOnlyDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
