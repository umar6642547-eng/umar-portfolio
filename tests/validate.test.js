import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContact } from '../server/lib/validate.js';

const good = { name: 'Ali Khan', email: 'Ali@Example.com ', message: 'Hello, we have an opening.' };

test('accepts a valid message and normalises email', () => {
  const r = validateContact(good);
  assert.equal(r.ok, true);
  assert.equal(r.value.email, 'ali@example.com');
});

test('rejects missing / wrong-type input', () => {
  for (const bad of [undefined, null, 'x', 42, [], {}]) {
    assert.equal(validateContact(bad).ok, false);
  }
  assert.equal(validateContact({ name: 123, email: {}, message: [] }).ok, false);
});

test('rejects bad emails', () => {
  for (const email of ['', 'abc', 'a@b', 'a b@c.com', '@x.com']) {
    assert.ok(validateContact({ ...good, email }).errors.email, email);
  }
});

test('enforces length limits', () => {
  assert.ok(validateContact({ ...good, name: 'A' }).errors.name);
  assert.ok(validateContact({ ...good, name: 'A'.repeat(81) }).errors.name);
  assert.ok(validateContact({ ...good, message: 'short' }).errors.message);
  assert.ok(validateContact({ ...good, message: 'x'.repeat(2001) }).errors.message);
  assert.equal(validateContact({ ...good, message: 'x'.repeat(2000) }).ok, true);
});

test('trims whitespace so blank padding cannot pass', () => {
  assert.ok(validateContact({ ...good, message: '          ' }).errors.message);
});
