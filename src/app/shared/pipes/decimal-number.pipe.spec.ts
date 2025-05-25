import { DecimalNumberPipe } from 'shared/pipes/decimal-number.pipe';

describe('GetFullNamePipe', () => {
  it('create an instance', () => {
    const pipe = new DecimalNumberPipe();
    expect(pipe).toBeTruthy();
  });

  it('should add decimals', () => {
    const pipe = new DecimalNumberPipe();
    expect(pipe.transform('312')).toEqual('312.00');
    expect(pipe.transform('312.3')).toEqual('312.30');
    expect(pipe.transform('312.30')).toEqual('312.30');
  });

  it('should remove decimals', () => {
    const pipe = new DecimalNumberPipe();
    expect(pipe.transform('312.333')).toEqual('312.33');
    expect(pipe.transform('312.356')).toEqual('312.36');
  });
});
