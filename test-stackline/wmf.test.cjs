const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const WMF = require('../');
function fixture(placeable) {
  const plain = Buffer.alloc(34);
  plain.writeUInt16LE(1, 0); plain.writeUInt16LE(9, 2); plain.writeUInt16LE(0x300, 4);
  plain.writeUInt32LE(17, 6); plain.writeUInt32LE(5, 12);
  plain.writeUInt32LE(5, 18); plain.writeUInt16LE(0x020c, 22);
  plain.writeUInt16LE(240, 24); plain.writeUInt16LE(320, 26);
  plain.writeUInt32LE(3, 28);
  if(!placeable) return plain;
  const header = Buffer.alloc(22);
  header.writeUInt32LE(0x9ac6cdd7, 0); header.writeUInt16LE(320, 10);
  header.writeUInt16LE(240, 12); header.writeUInt16LE(1440, 14);
  let checksum=0; for(let offset=0;offset<20;offset+=2) checksum ^= header.readUInt16LE(offset);
  header.writeUInt16LE(checksum,20);
  return Buffer.concat([header, plain]);
}
test('standard and placeable WMF retain record-derived dimensions and actions', () => {
  for(const placeable of [false,true]) {
    const bytes=fixture(placeable);
    for(const input of [bytes, Uint8Array.from(bytes), Uint8Array.from(bytes).buffer]) {
      assert.deepEqual(WMF.image_size(input),[320,240]);
      assert.deepEqual(WMF.get_actions(input),[]);
    }
  }
});
test('truncated standard and placeable headers report Error objects', () => {
  for(const bytes of [Buffer.alloc(3), fixture(true).subarray(0,30)]) {
    assert.throws(()=>WMF.image_size(bytes),{name:'Error',message:/truncated/});
    assert.throws(()=>WMF.get_actions(bytes),{name:'Error',message:/truncated/});
  }
});
test('invalid record sizes terminate instead of looping or reading beyond the input', () => {
  for(const size of [0,2,0xffffffff]) {
    const bytes=fixture(false); bytes.writeUInt32LE(size,18);
    assert.throws(()=>WMF.image_size(bytes),/invalid size/);
    assert.throws(()=>WMF.get_actions(bytes),/invalid size/);
  }
});
test('four public exports and browser global work without Buffer/process polyfills', () => {
  assert.deepEqual(Object.keys(WMF).sort(),['draw_canvas','get_actions','image_size','render_canvas']);
  const context=vm.createContext({Uint8Array,ArrayBuffer});
  vm.runInContext(fs.readFileSync('dist/wmf.js','utf8'),context);
  assert.deepEqual(Array.from(context.WMF.image_size(Uint8Array.from(fixture(true)))),[320,240]);
  assert.equal(context.WMF.get_actions(Uint8Array.from(fixture(true))).length,0);
  let calls=0;
  WMF.draw_canvas(fixture(true),{getContext() {calls++;return {};}});
  assert.equal(calls,1);
});
test('package includes declarations for its documented TypeScript entrypoint', () => {
  assert.ok(fs.existsSync('types/index.d.ts'));
  assert.ok(fs.existsSync('types/actions.d.ts'));
});
