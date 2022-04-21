const Warehouse = require('./index').Warehouse;

test('can init', () => {
  new Warehouse(1, 1);
});