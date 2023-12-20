import { PhoneTransformPipe } from './phone-transform.pipe';

describe('PhoneTransformPipe', () => {
  let pipe: PhoneTransformPipe;

  beforeEach(() => {
    pipe = new PhoneTransformPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform phone number to international format', () => {
    expect(pipe.transform('+380998887766')).toBe('+380 99 888 7766');
  });
});
