import { DateOnlyDirective } from './date-only.directive';

const elRefMock = { nativeElement: document.createElement('input') };

describe('DateOnlyDirective', () => {
  it('should create an instance', () => {
    const directive = new DateOnlyDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
