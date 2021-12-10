テスト駆動開発では、テストを先に書くわけですが、そのためには仕様が明確になっている必要があります。

> もし仕様が書けないのであれば、仕様が決まっていない、ひいては設計が完了していない、ということになります。
> そういう意味でも、テストを先に書いて仕様漏れ、検討漏れの防止にもなります。

リングバッファの仕様として、下記とします。

- コンストラクタ
    - ジェネリック型でバッファの型を指定できる。
    - 引数に、バッファのサイズを数値で指定できる。(2以上の整数)
        - 2未満の場合は、例外を発生させる。メッセージは、"引数のバッファサイズは 2以上 を指定して下さい。"
    - 現在のインデックスを '0' とする。
- push メソッド
    - リングバッファに引数の値をバッファの現在のインデックスの次に格納する。
    - バッファの現在の現在のインデックスを +1 する。
        - 最大バッファ数を超えす場合は、現在のインデックスを 0 とする。
- pop メソッド
    - バッファの現在のインデックスの値を返す。
    - 現在のインデックスを -1 する。
        - 0を下回る場合は、(最大バッファ数 -1 )とする。
    - 初期状態の場合は、undefined を返し、現在のインデックスは変更しない
- getCurrent メソッド
    - バッファの現在のインデックスの値を返す。
- currentIndex プロパティ
    - 読み込み専用
    - 現在のインデックスの数値を返す。
- toArray メソッド
    - 通常の配列を返す。
    - 値の順番は、先頭に現在のインデックスの値となるように、リングバッファの順番で出力する。
        - バッファが `['a', 'b', 'c']` で、現在のインデックスが '1'(2番め) の場合 `['b', 'c' ,'a']` となる

### コンストラクタのテスト

まず、リングバッファの実装をするファイル `RingBuffer.ts` と、そのテストのファイル `RingBuffer.test.ts` を作成します。
場所は、それぞれ `src/` , `src/__tests__/` で良いでしょう。

テストから書く、とはいってもクラスやそのメンバがなければ、そもそもコンパイルエラーでテストが実行できないので、想定されるクラスのメンバだけは実装しましょう。所謂スケルトンコードというものです。

関数の戻り値や変数の型違反にならないよう、最低限の return は書いています。

```ts title="src/RingBuffer.ts"
export class RingBuffer<T> {
  private buffer: T[] = [];
  private _currentIndex: number;
  constructor(size: number) {
    // 未実装
  }
  public toArray(): T[] {
    return [];
  }
  public push(item: T): void {
    // 未実装
  }
  public pop(): T {
    return {} as T
  }
  getCurrent(): T {
    return {} as T
  }
  get currentIndex(): number {
    return -1;
  }
}
```

テストコードを書きます。

まず、テスト対象のファイルを import します。

```ts title="src/__tests__/RingBuffer.test.ts"
import { RingBuffer } from '../RingBuffer';
```

はじめにコンストラクタ関数をテストを書きます。コンストラクタ関数では、引数で定義した数値の細部のバッファを持ちます。

仕様から評価を検討します。下記の2点が評価項目となるでしょう。

- buffer の配列の数が引数とあっているか。
- _currentIndex が、`0` であるか。

それぞれ private のメンバーですが、JavaScriptではインデクサにプロパティ名を入れることでアクセスできます。

```ts title="src/__tests__/RingBuffer.test.ts"
test('constructor', () => {
  const ringBuffer = new RingBuffer<string>(10);
  // 引数に、バッファのサイズを数値で指定できる。(2以上の整数)
  expect(ringBuffer['buffer'].length).toBe(10);
  // 現在のインデックスを '-1'(バッファがないため) とする。
  expect(ringBuffer['_currentIndex']).toBe(-1);
});
```

テストを実行します。

コンストラクタ関数には、まだ何も実装していないので、当然エラーになります。

```
> yarn test ./src/__tests__/RingBuffer.test.ts 

  ● constructor

    expect(received).toBe(expected) // Object.is equality

    Expected: 10
    Received: 0
```

テストが成功するように、実装しましょう。

```ts title="src/RingBuffer.ts"
  private buffer: T[]; // コンストラクタで初期化するので、初期値は不要
  /**
   *
   * @param size - バッファサイズ;
   */
  constructor(size: number) {
    this.buffer = new Array<T>(size);
    this._currentIndex = 0;
  }
```

もう一度テストします。

```
➜  practice git:(main) ✗ yarn test ./src/__tests__/RingBuffer.test.ts
yarn run v1.22.15
$ jest ./src/__tests__/RingBuffer.test.ts
 PASS  src/__tests__/RingBuffer.test.ts
  ✓ constructor (2 ms)
```

テストが成功しました。しかし、引数に入れられる値は、'2以上である'という制約がありますが、ここではこれでよいです。

1つのテストを成功させるため、最低限の実装だけを行います。

次にそのテストを書きましょう。別のテストとして書きます。

例外が発生する場合が成功となります。その場合は、`expect` の引数に関数を指定し、その中で例外が発生する可能性のある処理を書きます。

評価方法として、`.ThrowError` を利用します。引数に発生するはずのエラーメッセージを引数に指定します。

```ts title="src/__tests__/RingBuffer.test.ts"
test('constructor - failed', () => {
  // 2未満の場合は、例外を発生させる。
  // メッセージは、"引数のバッファサイズは 2以上 を指定して下さい。"
  expect(() => {
    new RingBuffer<string>(1);
  }).toThrowError('引数のバッファサイズは 2以上 を指定して下さい。');
});
```

入力チェックを実装していないので、例外は発生せずテストは失敗します。

その実装を入れます。

```ts title="src/RingBuffer.ts"
  constructor(size: number) {
    if (size < 2) {
      throw new Error('引数のバッファサイズは 2以上 を指定して下さい。');
    }
    this.buffer = new Array<T>(size);
    this._currentIndex = 0;
  }
```

テストが成功しました。

続いて、push のテストをします。push では、引数の値をバッファの先頭に格納します。

また、現在のインデックスを +1 します。それらを評価しましょう。

```ts title="src/__tests__/RingBuffer.test.ts"
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
```

実装していないので、エラーになります。成功するように書きましょう。

```ts title="src/RingBuffer.ts"
  public push(item: T) {
    if (this._currentIndex === -1) {
      this._currentIndex = 0;
    }
    this.buffer[this._currentIndex] = item;
  }
```

テストを実行すると、成功します。が、お気づきのように2回めの push ではおかしくなるはずです。でも今はこれで良いです。

仕様の 「リングバッファに引数の値をバッファの現在のインデックスの次に格納する。」 がテストできていません。

このテストを追加しましょう。

```ts title="src/__tests__/RingBuffer.test.ts"
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
```

テスト実行すると、失敗するでしょう。成功するように実装します。

```ts title="src/RingBuffer.ts"
  public push(item: T) {
    if (this._currentIndex === -1) {
      this._currentIndex = 0;
    } else {
      ++this._currentIndex;
    }
    this.buffer[this._currentIndex] = item;
  }
```

これでテストが成功します。しかし実装をよく見ると、`_currentIndex` が初期値の `-1` の場合でも 1 追加すれば良さそうで、そうなると `if` が必要無さそうです。

リファクタリングしましょう。

```ts title="src/RingBuffer.ts"
  public push(item: T) {
    this.buffer[++this._currentIndex] = item;
  }
```

テストを実行すると、ちゃんと成功しました。つまり、リファクタリングしても結果が変わらないことが保証されました。

テスト駆動開発では、テストを書く -> テストを満たす最低限の実装 -> リファクタリング　の流れで作成していきます。

push では、もう1つ確認しないといけない仕様があります。「最大バッファ数を超える場合は、現在のインデックスを 0 とする。」です。

これのテストを書いていきましょう。

バッファを埋めないといけないので、ループで push します。

```ts title="src/__tests__/RingBuffer.test.ts"
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
```

毎回のことながら、バッファがいっぱいになったときの実装していないのでエラーになります。

成功するように修正します。

```ts title="src/RingBuffer.ts"
  public push(item: T): void {
    if (++this._currentIndex > this.buffer.length - 1) {
      this._currentIndex = 0;
    }
    this.buffer[this._currentIndex] = item;
  }
```

次は、`pop` メソッドのテストを書きます。

まずは、ノーマルな処理で、最後に push した値が取得できることと、インデックスが戻っていることを確認します。

```ts title="src/__tests__/RingBuffer.test.ts"
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
```

失敗することを確認します。実装しましょう。

```ts title="src/RingBuffer.ts"
  public pop(): T {
    return this.buffer[this._currentIndex--];
  }
```

テストが成功しました。

現在のインデックスが 0 の場合、バッファの最後に移動するので、その動作を確認します。

```ts title="src/__tests__/RingBuffer.test.ts"
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
```

失敗を確認して、仕様を実装します。

```ts title="src/RingBuffer.ts"
  public pop(): T {
    const res = this.buffer[this._currentIndex--];
    if (this._currentIndex < 0) {
      this._currentIndex = this.buffer.length - 1;
    }
    return res;
  }
```

テストが成功することを確認します。

`getCurrent` と プロパティの`currentIndex` が残っていますが、これまでのものを参考にテストと実装が書けると思います。各自、実施してみて下さい。

## まとめ

テスト駆動開発について、ハンズオンを交えて説明しました。

テスト -> 実装 の流れをなんとなくでも掴むことができたでしょうか？

はじめにテストで失敗する事が大事です。まず仕様を正しく把握できますし、テストの実装違いで常に成功するテストを書いてしまうかもしれません。失敗から成功に変わる確認が必要です。

はじめのテストが失敗してから、成功するコードを書くときには、なるべく早く成功する方法で書きます。たとえそれが戻り値をハードコーディングすることでも良いです。成功することを確認した後、リファクタリングでテストが成功のままであることを確認します。

実装中にテストに必要な追加パターンが判明することがあります。それも随時テストに追加していくことが大事です。
