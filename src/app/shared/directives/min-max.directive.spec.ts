import { MinMaxDirective } from './min-max.directive';

let elRefMock = { nativeElement: document.createElement('input') };

describe('MinMaxDirective', () => {
  it('should create an instance', () => {
    const directive = new MinMaxDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
