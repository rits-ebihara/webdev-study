/* TODO
✔ 大きさを指定してバッファを作成する
- バッファから最新の値を取得する
- バッファから最新から指定した数を戻ったインデックスの値を取得する
- バッファに値を追加する
- buffer を非公開にする
*/

import { RingBuffer } from '../ringBuffer';

test('バッファの大きさを指定してバッファを作成する', () => {
  const ringBuffer = new RingBuffer(10);
  expect(ringBuffer.buffer.length).toBe(10);
});

test('バッファから最新の値を取得する', () => {
  const ringBuffer = new RingBuffer(5);
  ringBuffer.push('a1');
  ringBuffer.push('a2');
  expect(ringBuffer.getCurrent()).toBe('a2');
});
