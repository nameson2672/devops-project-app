const CalculationOperations = require('./calculator');

test('adds 1 + 2 to equal 3', () => {
  expect(CalculationOperations.add(1, 2)).toBe(3);
});

test('subtracts 5 - 2 to equal 3', () => {
  expect(CalculationOperations.subtract(5, 2)).toBe(3);
});

test('multiplies 3 * 4 to equal 12', () => {
  expect(CalculationOperations.multiply(3, 4)).toBe(12);
});

test('divides 10 / 2 to equal 5', () => {
  expect(CalculationOperations.divide(10, 2)).toBe(5);
});

test('throws error when dividing by zero', () => {
  expect(() => CalculationOperations.divide(10, 0)).toThrow('Cannot divide by zero');
});