const Warehouse = require('./index').Warehouse;

test('can init', () => {
  new Warehouse(1, 1);
});

test('cannot init invalid size', () => {
  expect(() => new Warehouse(0, 1)).toThrow("Warehouse must be at least 1x1");
});

test('can put an item', () => {
  const wh = new Warehouse(1, 1);
  wh.set(0, 0, 1, 1, 'a');
  expect(wh.locate('a')).toEqual([{x: 0, y: 0}]);
});

test('cannot put an item out of bounds on size', () => {
  const wh = new Warehouse(1, 1);
  expect(() => wh.set(0, 0, 2, 2, 'a')).toThrow("Out of bounds");
});

test('cannot put an item out of bounds on index', () => {
  const wh = new Warehouse(1, 1);
  expect(() => wh.set(1, 1, 1, 1, 'a')).toThrow("Out of bounds");
});

test('cannot put a zero sized item', () => {
  const wh = new Warehouse(1, 1);
  expect(() => wh.set(1, 1, 0, 0, 'a')).toThrow("Invalid dimensions");
});

test('cannot put the same item again', () => {
  const wh = new Warehouse(2, 1);
  wh.set(0, 0, 1, 1, 'a');
  expect(() => wh.set(1, 0, 1, 1, 'a')).toThrow("Value already exists");
});

test('items cannot intersect', () => {
  const wh = new Warehouse(4, 4);
  wh.set(0, 0, 3, 3, 'a');
  expect(() => wh.set(2, 2, 2, 2, 'b')).toThrow("Some space is not empty");
});

test('can remove an item at coords', () => {
  const wh = new Warehouse(5, 5);
  wh.set(2, 2, 3, 3, 'a');
  expect(wh.locate('a')).toEqual([
    [2, 2],
    [3, 2],
    [4, 2],
    [2, 3],
    [3, 3],
    [4, 3],
    [2, 4],
    [3, 4],
    [4, 4],
  ].map(([x, y]) => ({x, y})));
  wh.removeAtCoords(3, 4);
  expect(wh.locate('a')).toEqual([]);
});

test('remove is NOT idempotent', () => {
  const wh = new Warehouse(5, 5);
  expect(() => wh.removeAtCoords(3, 4)).toThrow("Value not found at coords");

});