import { PhonePipe } from './phone.pipe';

describe('PhonePipe', () => {
  let pipe: PhonePipe;

  beforeEach(() => {
    pipe = new PhonePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform phone number to international format', () => {
    expect(pipe.transform('+380998887766')).toBe('+380 99 888 7766');
  });
});
