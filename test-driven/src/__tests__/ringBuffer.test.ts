/*
+ バッファの大きさを指定してバッファを作成する
- 最新のバッファを取得する
- 最新から指定した数を戻ったインデックスの値を取得する
- length は、バッファの大きさを返す
*/

import { RingBuffer } from '../ringBuffer';

test('バッファの大きさを指定して作成する', () => {
  const buffer = new RingBuffer(10);
  expect(buffer.length).toBe(10);
});
