import { GetFullNamePipe } from './get-full-name.pipe';

describe('GetFullNamePipe', () => {
  it('create an instance', () => {
    const pipe = new GetFullNamePipe();
    expect(pipe).toBeTruthy();
  });
});
