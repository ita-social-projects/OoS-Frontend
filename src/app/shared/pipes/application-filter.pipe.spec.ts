import { ApplicationFilterPipe } from './application-filter.pipe';

describe('ApplicationFilterPipe', () => {
  let pipe: ApplicationFilterPipe;

  beforeEach(() => {
    pipe = new ApplicationFilterPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
