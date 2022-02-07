import { KeyFilterDirective } from './key-filter.directive';

const elRefMock = { nativeElement: document.createElement('input') };

describe('KeyFilterDirective', () => {
  it('should create an instance', () => {
    const directive = new KeyFilterDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
