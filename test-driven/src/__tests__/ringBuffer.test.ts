/*
✔ 大きさを指定してバッファを作成する
✔ バッファから最新の値を取得する
✔ バッファから最新から指定した数を戻ったインデックスの値を取得する
✔ バッファに値を追加する
- buffer を非公開にする
✔ バッファの型を指定できるようにし、any を排除する
✔ バッファの大きさの制限を設ける
*/

import { RingBuffer } from '../ringBuffer';

test('バッファの大きさを指定してバッファを作成する', () => {
  const ringBuffer = new RingBuffer(10);
  expect(ringBuffer['buffer'].length).toBe(10);
});

test('バッファから最新の値を取得する', () => {
  const ringBuffer = new RingBuffer(5);
  ringBuffer.push('a1');
  ringBuffer.push('a2');
  expect(ringBuffer.getCurrent()).toBe('a2');
});

test('バッファに値を追加する', () => {
  const ringBuffer = new RingBuffer(5);
  ringBuffer.push('a1');
  ringBuffer.push('a2');
  expect(ringBuffer['buffer']).toEqual([
    'a1',
    'a2',
    undefined,
    undefined,
    undefined,
  ]);
});

test('バッファに値を追加する バッファサイズを超える場合', () => {
  const ringBuffer = new RingBuffer(5);
  for (let i = 1; i < 7; i++) {
    ringBuffer.push(`a${i}`);
  }
  expect(ringBuffer['buffer']).toEqual(['a6', 'a2', 'a3', 'a4', 'a5']);
});

test('バッファから最新から指定した数を戻ったインデックスの値を取得する', () => {
  const ringBuffer = new RingBuffer(5);
  ringBuffer.push('a1');
  ringBuffer.push('a2');
  expect(ringBuffer.get(1)).toBe('a1');
});

test('バッファから最新から指定した数を戻ったインデックスの値を取得する - リングをまたぐ場合', () => {
  const ringBuffer = new RingBuffer(5);
  for (let i = 1; i < 7; i++) {
    ringBuffer.push(`a${i}`);
  }
  expect(ringBuffer.get(1)).toBe('a5');
});

test('バッファの方を指定できるようにする', () => {
  const ringBuffer = new RingBuffer<number>(5);
  ringBuffer.push(0);
  expect(ringBuffer.getCurrent()).toBe(0);
});

test('バッファの大きさの制限を設ける', () => {
  expect(() => new RingBuffer(2)).toThrowError(
    '引数は 3 - 1000 の間がサポートされます。',
  );
  expect(() => new RingBuffer(3)).not.toThrow();
  expect(() => new RingBuffer(1000)).not.toThrow();
  expect(() => new RingBuffer(1001)).toThrowError(
    '引数は 3 - 1000 の間がサポートされます。',
  );
});
