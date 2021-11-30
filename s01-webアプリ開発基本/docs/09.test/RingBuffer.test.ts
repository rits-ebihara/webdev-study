import { RingBuffer } from '../RingBuffer';

test('constructor', () => {
  const ringBuffer = new RingBuffer<string>(10);
  // 引数に、バッファのサイズを数値で指定できる。(2以上の整数)
  expect(ringBuffer['buffer'].length).toBe(10);
  // 現在のインデックスを '-1'(バッファがないため) とする。
  expect(ringBuffer['_currentIndex']).toBe(-1);
});

test('constructor - failed', () => {
  // 2未満の場合は、例外を発生させる。
  // メッセージは、"引数のバッファサイズは 2以上 を指定して下さい。"
  expect(() => {
    new RingBuffer<string>(1);
  }).toThrowError('引数のバッファサイズは 2以上 を指定して下さい。');
});

test('push - first', () => {
  const ringBuffer = new RingBuffer<string>(10);
  // はじめのインデックスが '-1' であることを確認する
  expect(ringBuffer['_currentIndex']).toBe(-1);
  // push実行
  ringBuffer.push('test1');
  // リングバッファに引数の値をバッファの現在のインデックスの次に格納する。
  // 現在のインデックスが '-1'（初期状態）の場合は、'0' に格納する。
  expect(ringBuffer['buffer'][0]).toBe('test1');
  // バッファの現在の現在のインデックスを +1 する。
  expect(ringBuffer['_currentIndex']).toBe(0);
});

test('push - seconds', () => {
  const ringBuffer = new RingBuffer<string>(10);
  // はじめのインデックスが '-1' であることを確認する
  expect(ringBuffer['_currentIndex']).toBe(-1);
  // push実行
  ringBuffer.push('test1');
  ringBuffer.push('test2');
  // リングバッファに引数の値をバッファの現在のインデックスの次に格納する。
  expect(ringBuffer['buffer'][1]).toBe('test2');
  // バッファの現在の現在のインデックスを +1 する。
  expect(ringBuffer['_currentIndex']).toBe(1);
});

test('push - full', () => {
  const ringBuffer = new RingBuffer<string>(5);
  // はじめのインデックスが '-1' であることを確認する
  expect(ringBuffer['_currentIndex']).toBe(-1);
  // 前提データの作成
  for (let i = 0; i < 5; i++) {
    ringBuffer['buffer'][i] = 'test' + i;
  }
  ringBuffer['_currentIndex'] = 4;
  // push実行
  ringBuffer.push('test - add');
  // リングバッファに引数の値をバッファの現在のインデックスの次に格納する。
  expect(ringBuffer['buffer'][0]).toBe('test - add');
  // バッファの長さが変わらない
  expect(ringBuffer['buffer'].length).toBe(5);
  // バッファの現在の現在のインデックスを +1 する。
  expect(ringBuffer['_currentIndex']).toBe(0);
});

test('pop - normal', () => {
  const ringBuffer = new RingBuffer<string>(10);
  // 前提データの作成
  for (let i = 0; i < 5; i++) {
    ringBuffer['buffer'][i] = 'test' + i;
  }
  ringBuffer['_currentIndex'] = 4;
  const result = ringBuffer.pop();
  // バッファの現在のインデックスの値を返す。
  expect(result).toBe('test4');
  // 現在のインデックスを -1 する。
  expect(ringBuffer['_currentIndex']).toBe(3);
});

test('pop - back to last', () => {
  const ringBuffer = new RingBuffer<string>(5);
  // 前提データの作成
  for (let i = 0; i < 5; i++) {
    ringBuffer['buffer'][i] = 'test' + i;
  }
  ringBuffer['_currentIndex'] = 0;

  const result = ringBuffer.pop();
  // バッファの現在のインデックスの値を返す。
  expect(result).toBe('test0');
  // 現在のインデックスを -1 する。
  expect(ringBuffer['_currentIndex']).toBe(4);
});
