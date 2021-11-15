# Webアプリケーションのテスト

## 概要

ここでは、Webアプリケーションのテストについて解説します。

テスト全般の話と、主に Unit Test として書かれるテストプログラムとそれに使用するテストフレームワークについて、説明します。

## テストは必須

### 品質はテストできない

> 「テストから見えてくる グーグルのソフトウェア開発」より抜粋  
> 「品質はテストではない。品質は、開発とテストを互いに区別できなくなるまでに融合することによって実現される。」

### テスト書いてないとか・・・

<pre>
　　　　 ,、,,,、,,, 
　　　 _,,;' '" '' ;;,, 
　　（rヽ,;''""''゛゛;,ﾉｒ）　　　　 
　　 ,; i ___　、___iヽ゛;,　　テスト書いてないとかお前それ
　 ,;'''|ヽ・〉〈・ノ |ﾞ ';,    @t_wadaの前でも同じ事言えんの？
　 ,;''"|　 　▼　　 |ﾞ゛';, 
　 ,;''　ヽ ＿人＿  /　,;'_ 
 ／ｼ、    ヽ  ⌒⌒  /　 ﾘ　＼ 
|　　 "ｒ,,｀"'''ﾞ´　　,,ﾐ| 
|　　 　 ﾘ、　　　　,ﾘ　　 | 
|　　i 　゛ｒ、ﾉ,,ｒ" i _ | 
|　　｀ー――-----------┴ ⌒´ ） 
（ヽ  _____________ ,, ＿´） 
 （_⌒_______________ ,, ィ 
     T                 |
     |                 |
</pre>

[プログラマでテスト駆動開発者の@t_wadaさんをお招きした社内勉強会での様子をお届け！＃メルカリな日々 | mercan (メルカン)](https://mercan.mercari.com/articles/19386/)

> @t_wada：時間を優先するために品質を犠牲にできると信じている人もなかにはいるが、それは「間違い」である。短期的には速度があがっているように見えても、それは「一時的な錯覚」。この短期的の終わりがくる損益分岐点は、3年後とかではなく、1ヶ月以内にあらわれる。つまり、ソフトウェアにおける品質である内部品質を上げることで、手戻りや無駄がなくなり結果的にスピードがあがる。それによって学びのループを高速に回せて外部品質が上がる。

## テストの種類

テストには、通常、テストの範囲、目的によって「単体」「結合(統合)」「総合」と分け方をすることが多いですが、場合によっては４区分くらいに分ける場合もあります。

また、プロジェクトによって同じ名称でも内容が異なることがあるので、チームで明示的に定義する必要があります。

ちなみに、下記書籍で Google でのソフトウェア開発におけるテストでは、上記の呼称ではなく、small, medium, large, enormous(巨大な) の指針の例として、下記が挙げられています。

[テストから見えてくる グーグルのソフトウェア開発 | ジェームズ・ウィテカー, ジェーソン・アーボン, ジェフ・キャローロ, 長尾高弘 |本 | 通販 | Amazon](https://www.amazon.co.jp/%E3%83%86%E3%82%B9%E3%83%88%E3%81%8B%E3%82%89%E8%A6%8B%E3%81%88%E3%81%A6%E3%81%8F%E3%82%8B-%E3%82%B0%E3%83%BC%E3%82%B0%E3%83%AB%E3%81%AE%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E9%96%8B%E7%99%BA-%E3%82%B8%E3%82%A7%E3%83%BC%E3%83%A0%E3%82%BA%E3%83%BB%E3%82%A6%E3%82%A3%E3%83%86%E3%82%AB%E3%83%BC/dp/482228512X)

(書籍からの要約です。(補足)　は、海老原の所感です。)

- small
    - 環境から切り離してコード単一の振る舞いをチェックする。たとえばクラスや関数単位のでテスト。
    - Googleの社外では一般的には「単体テスト」と呼ばれる。
    - 大規模テストでは到達不可能なところまで包括的にカバーする。
    - 外部のサービス、モジュールはモックとし、外部依存がないものとする。
        - (補足)外部とはテスト対象のモジュールではないもの。JavaScriptのプロジェクトではモジュール ≒ ファイル。  
      とはいえ、文字列変換など単純なユーティリティ的なものはモック化しないことも。  
      その場合でも、自作のユーティリティであれば、それ自体も単体でテストする。
    - 頻繁に実行され高速に実行できること。
    - 実装と同時にテストコードを書いていく必要がある。
        - (補足)コーディング -> テスト記述 ->  実行 -> コーディング を繰り返す。

- medium
    - 複数のモジュール間のやり取りをチェックする。
    - Googleの社外では一般的には「統合テスト」と呼ばれる。
    - small テストより範囲が広く、時間もかかる。
    - モジュールの限られたサブセットとの間のやり取りをテストする。
    - 対象以外のモジュールはモック化することが多い。
        - (補足)localhost で実行される DB などに接続することなどはある。
    - 実行タイミングは、small よりもまばら。
        - (補足)自動テストができれば、1日に1回くらいか。
        - (補足)手動であれば、実装、small テストが終わった段階で、など。

- large, enormous
    - システム全体が正しく動作しているかをチェックする。
        - (補足)複数のシステムで1つの要件を満たす場合など、個々のシステムのテストを large、全体を enormous とすることになるかと思う。
        - (補足)コンテナによるモジュール化、マイクロサービス化が進むと、どのテストレベルでどういった組み合わせを行うかの検討が必要。
    - 環境は本番と同じか近いもので、モックは使うことはない。
    - 外部のサービスなどのリソースを使うこともある。
        - (補足)large では、軽量フェイクのサービス、enormous は、先方が用意しているの検証環境といった区別があるかと思う。
    - 基本的に手動で時間のかかるテストとなる。
        - (補足)実行のタイミングは、リリース前が考えられる

これらの区分は、Google 内でもプロジェクトや製品ごとに細かく違うそうで、作っているものの性質、チームメンバーのスキルなどに合わせて定義する必要があります。

ここでは、テストの呼称を上の small, medium, large, enormous として呼ぶこととします。

## テストの自動化

継続してメンテナンスするアプリケーションについては、各テストレベルでは、できる限り自動テストを実行すべきです。

"問題が、人間の直感や習慣、思考に関するものでなければ自動化すべし"と Google の指針でも謳っています。

テスト規模が小さくなるほど、機械で判断できる事が多いと思うので、smallテストでは、現在はテストを書くことが必須である、という認識でいるべきでしょう。

## JavaScript / TypeScript における テストフレームワーク

JavaScript に限らず、テストコードを書いたり実施するには、効率化のためテストフレームワークを利用することが多いです。

テストフレームワークでは下記のような機能を提供します。

- テストの記述ルール
- モック作成
- 評価・結果の表示
- ブラウザなどUIのシミュレート
- カバレッジ

基本的に、ブラウザなどUIを使用せず、シェル上で動作することが必要です。そうすることで Git にプルリクした時や、リリース前に自動でテストを流す、ということができるからです。

JavaScript / TypeScript 用のテストフレームワークは、いくつかありますが、Jest と呼ばれるものが最も使用されていると思います。

[Jest · 🃏 Delightful JavaScript Testing](https://jestjs.io/ja/#:~:text=Jest%20%E3%81%AF%E3%81%82%E3%82%89%E3%82%86%E3%82%8B%20JavaScript%20%E3%81%AE,%E3%83%86%E3%82%B9%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%E3%82%AF%E3%81%A7%E3%81%99%E3%80%82)

特徴として下記があるとおもいます。

- 必要なものがワンパッケージになっている。
- モックが書きやすい。
- 結果が見やすい。

## Jest でのテストコードの実践

以前作った React のプロジェクトを利用します。

プロジェクトフォルダで、yarn で Jest をインストールします。同時に、TypeScript でテストを書きたいので、Jest の型定義 `@types/jest` と TypeScript でテストを直接実行するための、`ts-jest`

[ts-jest](https://kulshekhar.github.io/ts-jest/)

```
yarn add -D jest @types/jest ts-jest
```

Jest の設定ファイルを作成します。 `--init` をオブションにつけて実行すると、ウィザード形式で作成できます。

```shell
> yarn jest --init

# package.json のスクリプトに、テストを実行する "test" を追加してよいか？
✔ Would you like to use Jest when running "test" script in "package.json"? … yes
#  設定ファイルを TypeScript  で出力するか？
✔ Would you like to use Typescript for the configuration file? … no
#  テストを実行する環境
✔ Choose the test environment that will be used for testing › node
# カバレッジレポートを出力するか？（実行時にオプションで指定もできる）
✔ Do you want Jest to add coverage reports? … no
#  カバレッジレポートの計測に、どのプロバイダを使用するか
✔ Which provider should be used to instrument code for coverage? › v8
# テストごとに自動的にモックのクリア（spyの計測値をリセットする）する。
✔ Automatically clear mock calls and instances between every test? … yes
```

`jest.config.js` が作成されました。

このファイルを開き、`ts-jest` のための設定を行います。

```js
module.exports = {
    // 他の設定
    preset: "ts-jest", // <-- 追加
};
```

簡単なテストを書いて試してみます。`src`ディレクトリの下に、`__tests__` フォルダを作成します。テストのファイルを入れるディレクトリとして、この名前が一般的です。

ここに、`first-test.test.ts`ファイルを作成します。内容を下記のようにします。ファイル名の末尾が `.test.ts` なのも慣習的なものです。VSCode のファイルリストではテストのアイコンに変わるため、判別しやすくなります。

```ts
test('first-rest', () => {
  const a = 'test';
  expect(a).toBe('test');
});
```

これは、変数 `a` が "test" という文字列であるか、という確認になります。当たり前ですが、これはテストが成功します。シェルで `yarn test` を実行します。

```
> yarn test
yarn run v1.22.15
$ jest
 PASS  src/__tests__/first-test.test.ts
  ✓ first-rest (3 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.348 s
Ran all test suites.
Done in 4.99s.
```

失敗させてみます。 `const a = 'test1'` に変更して、再度テストを実施します。

```
> yarn test
yarn run v1.22.15
$ jest
 FAIL  src/__tests__/first-test.test.ts
  ✕ first-rest (3 ms)

  ● first-rest

    expect(received).toBe(expected) // Object.is equality

    Expected: "test"
    Received: "test1"

      1 | test('first-rest', () => {
      2 |   const a = 'test1';
    > 3 |   expect(a).toBe('test');
        |             ^
      4 | });
      5 |

      at Object.<anonymous> (src/__tests__/first-test.test.ts:3:13)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.003 s, estimated 5 s
Ran all test suites.
error Command failed with exit code 1.
```

このように、どこでどのように失敗したかがわかりやすく表示されます。

> Linux (WSLなども)、Powershell では 結果に色がついて見やすくなります。  
> Windows のコマンドプロンプトには色をつける機能はないので、単色で表示されます。
> WSL か、Powershell の使用をおすすめします。

## テスト駆動開発の実践

ここではテスト駆動開発の実践として、リングバッファのクラスを実装することを題材としてみます。

### リングバッファの仕様

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

テストから書く、とはいってもクラスやそのメンバがなければ、そもそもコンパイルエラーでテストが実行できないので、クラスのメンバだけは実装しましょう。所謂スケルトンコードというものです。

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

テストが成功しました。

引数に入れられる値は、'2以上である'という制約があります。そのテストを書きましょう。別のテストとして書きます。

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

テストを実行すると、成功します。が、お気づきのように2回めの push ではおかしくなるはずです。

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

開発を進めていくと、どこかでリファクタリングを行う必要が出てきます。ただ、今正しく動いているコードを修正するのは勇気がいります。

そのときに、このようにテストをしっかり書いておくことでリファクタリングがしやすくなります。

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

```ts
  public pop(): T {
    return this.buffer[this._currentIndex--];
  }
```

テストが成功しました。

現在のインデックスが 0 の場合、バッファの最後に移動するので、その動作を確認します。

```ts
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

`getCurrent` と プロパティの`currentIndex` が残っていますが、これまでのものを参考にテストと実装が書けると思います。

各自、実施してみて下さい。
