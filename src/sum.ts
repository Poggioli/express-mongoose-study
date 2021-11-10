const Sum = (...values: number[]): number => (!values.length ? 0 : values
  .reduce(((previous: number, currentValue: number) => previous + currentValue), 0));

export default Sum;
