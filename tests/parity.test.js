// The browser and server each have a copy of fmt(); they must never diverge.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fmt as serverFmt } from '../server/lib/finance.js';
import { fmt as clientFmt } from '../client/src/money.js';

test('client fmt() equals server fmt() for a spread of values', () => {
  for (const v of [0, 1, 5, 999, 1000, 1234, 17500, 192500, 3200000, 1234567890, -1, -1250, -3200000]) {
    assert.equal(clientFmt(v), serverFmt(v), String(v));
  }
});
