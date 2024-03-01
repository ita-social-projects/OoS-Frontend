import { DeclinationPipe } from './declination.pipe';

describe('DeclinationPipe', () => {
  let pipe: DeclinationPipe;

  beforeEach(() => {
    pipe = new DeclinationPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should handle singular correctly', () => {
      const declination = pipe.transform(1, MockDeclination);

      expect(declination).toEqual(`1 ${MockDeclination[0]}`);
    });

    it('should handle few (2-4) correctly', () => {
      for (let i = 2; i <= 4; i++) {
        const declination = pipe.transform(i, MockDeclination);

        expect(declination).toEqual(`${i} ${MockDeclination[1]}`);
      }
    });

    it('should handle many (5+) correctly', () => {
      [5, 10, 20].forEach((quantity) => {
        const declination = pipe.transform(quantity, MockDeclination);

        expect(declination).toEqual(`${quantity} ${MockDeclination[2]}`);
      });
    });

    it('should handle unique rule (11-14) correctly', () => {
      [11, 12, 13, 14].forEach((quantity) => {
        const declination = pipe.transform(quantity, MockDeclination);

        expect(declination).toEqual(`${quantity} ${MockDeclination[2]}`);
      });
    });

    it('should handle 0 correctly', () => {
      const declination = pipe.transform(0, MockDeclination);

      expect(declination).toEqual(` ${MockDeclination[3]}`);
    });

    it('should return empty string if declinations is not provided', () => {
      expect(pipe.transform(1)).toEqual('');
    });
  });
});

enum MockDeclination {
  'DECLINATION',
  'DECLINATIONS',
  'DECLINATIONS_ABLATIVE',
  'NO_DECLINATIONS'
}
