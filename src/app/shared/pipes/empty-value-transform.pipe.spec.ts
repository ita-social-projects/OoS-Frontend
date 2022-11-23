import { EmptyValueTransformPipe } from './empty-value-transform.pipe';

describe('EmptyValueTransformPipe', () => {
  it('create an instance', () => {
    const pipe = new EmptyValueTransformPipe();
    expect(pipe).toBeTruthy();
  });
});
