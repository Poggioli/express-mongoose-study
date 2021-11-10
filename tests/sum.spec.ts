import Sum from '../src/sum';

describe('Sum', () => {
  it('Should be 0 if value is not provided', () => {
    expect(Sum()).toBe(0);
  });

  it('Should be 0 if value is provided but there is no item', () => {
    expect(Sum(...[])).toBe(0);
  });

  it('Should be 10 if values is 1,2,3 and 4', () => {
    expect(Sum(1, 2, 3, 4)).toBe(10);
  });
});
