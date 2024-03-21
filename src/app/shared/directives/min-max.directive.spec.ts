import { MinMaxDirective } from './min-max.directive';

const elRefMock = { nativeElement: document.createElement('input') };

describe('MinMaxDirective', () => {
  let directive: MinMaxDirective;

  it('should create an instance', () => {
    directive = new MinMaxDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
