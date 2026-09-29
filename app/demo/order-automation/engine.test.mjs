import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultMapping, examples, initialStore, processOrder } from './engine.ts';
test('single item and slipcover-only are each one row in each output', () => {
  for (const example of [examples[0], examples[2]]) {
    const { store, result, status } = processOrder(example.order, defaultMapping, initialStore);
    assert.equal(status, 'written'); assert.equal(result.lineCount, 1);
    assert.equal(store.fulfillment.length, 1); assert.equal(store.payments.length, 1);
    assert.equal(store.fulfillment[0].orderId, store.payments[0].orderId);
  }
});
test('three lines independently resolve and unknown title is retained', () => {
  const { store, result } = processOrder(examples[1].order, defaultMapping, initialStore);
  assert.equal(result.lineCount, 3); assert.equal(result.skus.split('\n').length, 3);
  assert.match(result.skus, /SOFA-CLASSIC/); assert.match(result.skus, /CUSHION-LINEN/);
  assert.match(result.skus, /UNMAPPED: Limited Edition Throw/);
  assert.deepEqual(result.unmapped, ['Limited Edition Throw']);
  assert.equal(store.fulfillment.length, 1); assert.equal(store.payments.length, 1);
  assert.equal(result.date, '09/25/2026');
  assert.equal(processOrder(examples[1].order, defaultMapping, initialStore, 'Asia/Jakarta').result.date, '09/26/2026');
});
test('replay skips both writes', () => {
  const first = processOrder(examples[1].order, defaultMapping, initialStore);
  const second = processOrder(examples[1].order, defaultMapping, first.store);
  assert.equal(second.status, 'duplicate'); assert.equal(second.store, first.store);
  assert.equal(second.store.fulfillment.length, 1); assert.equal(second.store.payments.length, 1);
});
test('reject bad input and duplicate mapping', () => {
  assert.throws(() => processOrder({ ...examples[0].order, items: [] }, defaultMapping, initialStore));
  assert.throws(() => processOrder(examples[0].order, [...defaultMapping, defaultMapping[0]], initialStore));
});
