import { LocalDatePipe } from 'shared/pipes/local-date.pipe';

describe('JoinPipe', () => {
  it('create an instance', () => {
    const pipe = new LocalDatePipe();
    expect(pipe).toBeTruthy();
  });
});
