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
        - (補足)small test として開発ステップがあるのではなく、実装に small test が含まれる。(開発とテストの融合)
        - (補足)テスト記述 -> コーディング -> リファクタ を繰り返す。

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

## テスト駆動開発（TDD） / ビヘイビア開発（BDD）

テスト駆動開発とは（TDD）、はじめにテストを書き、そのテストが成功するのに最低限必要な実装を行ってテストを成功させ、コードを洗練させる（リファクタリング）という、短い繰り返しで実装を行うスタイルのことです。

メリットとして、下記が挙げられます。

- 必要最低限のコードしか書かなくなる。
- コードのリファクタや変更による影響をすぐに確認できる。
- 複雑な仕様を1つずつ整理しながら実装することで、実装の速度を上げられる。
- 

ビヘイビア開発（BDD）は、TDD を拡張し、要求仕様から振る舞いや条件などを自然言語に近い形でテストコードを記述する点が上げられます。テスト駆動開発が、テストを先に書くことに比べ、仕様を先に書く、という点が異なります。

個人的には、仕様≒テスト だと思いますので、TDD を始めると自然な形として BDD に帰着するのだと思います。

[テスト駆動開発／振る舞い駆動開発を始めるための基礎知識：いまさら聞けないTDD/BDD超入門（1）（3/3 ページ） - ＠IT](https://atmarkit.itmedia.co.jp/ait/articles/1403/05/news035_3.html)

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

プロジェクトフォルダで、yarn で Jest をインストールします。同時に、TypeScript でテストを書きたいので、Jest の型定義 `@types/jest` と TypeScript でテストを直接実行するための `ts-jest` をあわせて入れます。

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

## テスト駆動開発

ここではテスト駆動開発の実践として、リングバッファのクラスを実装することを題材としてみます。

テスト駆動開発とは、コードを設計・実装するのにテストを軸に進めていくという、開発手法であり、決してテスト手法ではない、ということに注意すべきです。

テストファースト、という実装方法もありますが、これはあくまでもテストを先に書く、という実装手法であり、設計には及んでいません。

### 開発サイクル

テスト駆動開発では、下記のようなステップを繰り返して進めます。

1. テストを書く
     - 必ず失敗する
2. テストが成功するようにコードを書く
     - 成功すること重点を置き、コードの見やすさ、管理のしやすさなどは度外視する。
     - ここに時間を掛けないようにする。
3. コードをリファクタリングする。
     - ここで時間を掛けて、コードの見やすさ、運用のしやすさ、重複の排除などを行う。

また、実装中に生じた懸念やテスト不足は、Todo としてどんどん足して、それらを解消するように上のステップを繰り返していきます。

ここで、実際にコードを書きながらテスト駆動開発を体験してみましょう。

### リングバッファの仕様

バッファとは、データを一時的に保持しておくものです。データの提供側と受け取り側のタイミングが異なる場合などに使用します。簡単な例だと、クリップボードがバッファと言えるでしょう。

リングバッファは、同じ型の複数のデータをキャッシュしますが、バッファとして上限が有り、上限に達すると、はじめのバッファを上書きしていくようにします。

リングバッファから値を取り出すときには、最新のものを取得したり、最新からいくつか古いデータを取り出したりします。

ですので、現在の最新がどこであるかの場所も保持しておく必要がありそうです。

### プロジェクトの準備

空のフォルダを作成し、プロジェクトフォルダとします。

`package.json` を作成し、必要なライブラリをインストールします。

ここでは、言語は `TypeScript`、テストフレームワークは、`jest` を利用します。
```bash
$ npm init # Enter 連打でウィザードを終了させる
$ npm install -D typescript ts-node eslint prettier eslint-config-prettier jest jest ts-jest @types/jest
```

eslint の設定

```bash
$ npx eslint --init
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · node
✔ What format do you want your config file to be in? · YAML
✔ Would you like to install them now with npm? · No / Yes
```

`.eslint.yml` の修正

```yml
plugins:
  - "@typescript-eslint"
  - prettier # 追加
```

tsconfig.json の作成

```bash
$ npx tsc --init -moduleResolution node
```

prettier の設定ファイルのロード  
※ Linux, macOSの場合。windows の場合は、Powershell を使用する
```bash
curl -LO https://raw.githubusercontent.com/rits-ebihara/webdev-study/main/practice-react/.prettierrc.yml
```

Visual Studio Code を使っていて、ESLint や Prettier の拡張機能が入っていない場合は、入れておくと便利です。

[ESLint - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

[Prettier - Code formatter - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

ソースコードのフォルダを作成します。

`src` と その中に、テストのファイルを格納する `__tests__` を用意します。

```bash
mkdir -p src/__tests__
```

実装を書いていく `src/ringBuffer.ts` と、そのテストを書いていく `src/__tests__/ringBuffer.test.ts` を作成しましょう。

```bash
touch src/ringBuffer.ts
touch src/__tests__/ringBuffer.test.ts
```

jest の設定をします。

```bash
$ npx jest --init
✔ Would you like to use Jest when running "test" script in "package.json"? … yes
✔ Would you like to use Typescript for the configuration file? … no
✔ Choose the test environment that will be used for testing › node
✔ Do you want Jest to add coverage reports? … no
✔ Which provider should be used to instrument code for coverage? › v8
✔ Automatically clear mock calls, instances and results before every test? … yes
```

ts-jest の設定のため、`jest.config.js` を変更します。

```js title="jest.config.js"
  preset: 'ts-jest',
```

### TODO を考える

リングバッファを作る上で、はじめに考えられる機能や確認事項を列挙してみましょう。

今はあまり深く考えなくていいです。この TODO は実装中に判明した問題や課題を追加していくことになります。

TODO をテストファイルにコメントとして記載していきましょう

```ts title="src/__tests__/ringBuffer.test.ts"
/*
+ バッファの大きさを指定してバッファを作成する
- 最新のバッファを取得する
- 最新から指定した数を戻ったインデックスの値を取得する
*/
```

まず、 "バッファの大きさを指定してバッファを作成する" を実装してみます。これから取り掛かるタスクの先頭を `+` にしておいてわかりやすくしましょう。

### バッファの大きさを指定してバッファを作成する

バッファを作成する、ということはプログラム的にはオブジェクトを作成するということで、ここではクラスを作成し、 `new` でインスタンスを作ることとしましょう・・・ではなく、テストでそれを書きましょう。

```ts title="src/__tests__/ringBuffer.test.ts"
import { RingBuffer } from '../ringBuffer';

test('バッファの大きさを指定して作成する', () => {
  const buffer = new RingBuffer(10);
  expect(buffer.length).toBe(10);
});
```

あなたの言いたいこと、わかっていますよ。クラスもないのでそもそもテストも実行できていません。VSCode も怒っています。

TypeScript でコンパイルできるようにしましょう。また、最低限必要なメソッドも揃えましょう。

- クラスが必要
- コンストラクタが必要
- `length` プロパティが必要

```ts title="src/ringBuffer.ts"
export class RingBuffer {
  constructor(size: number) {}
  public length: number = 0;
}
```

length プロパティは、メソッドのほうが後々良い気がします。なぜなら、値そのものを保持するのではなく、おそらく後で保持するであろうバッファの大きさを返すことになりそうですから。

ですが、目の前の課題に集中するため、ここでの懸念今は一旦おいておきます。TODO に追加しておきましょう。

```ts title="src/__tests__/ringBuffer.test.ts"
/*
+ バッファの大きさを指定してバッファを作成する
- 最新のバッファを取得する
- 最新から指定した数を戻ったインデックスの値を取得する
- length は、バッファの大きさを返す
*/
```

コンパイルエラーがなくなりました。テストが実行できます。

```
    expect(received).toBe(expected) // Object.is equality

    Expected: 10
    Received: undefined
```

当たり前ですが、エラーになります。エラーが起きて良いんです。前進しています。このエラーが無くなるように "最低限" の実装します。

```ts title="src/ringBuffer.ts"
  public length: number = 10;
```

```
 PASS  src/__tests__/ringBuffer.test.ts
  ✓ バッファの大きさを指定して作成する (1 ms)
```

テストが成功しました！・・・はい、わっています。こんな実装は意味がないような気がします。しかし、１歩ずつ確認することが複雑な課題を単純化・細分化して考えることができます。

次のステップとしては、"重複"を取り除きます。ここでいう "重複" とは、同じコードが複数あることを指すことですが、今回はデータが重複してます。それは、テストコードと実装のコードでデてきている `10` という数字です。

ここでは、コンストラクタ関数に渡した値を 'length' として参照できればいいので、下記のようなコードになります。

```ts
export class RingBuffer {
  constructor(size: number) {
    this.length = size;
  }
  public length: number;
}
```

```
 PASS  src/__tests__/ringBuffer.test.ts
  ✓ バッファの大きさを指定して作成する (1 ms)
```

テストが成功しますね！

このように、細かくステップを踏んで進めていくことが大事です。実際ここまで細かくやるのかというと、Noです。ですが、複雑な問題を考えるときに、このように細かくステップを分ける、ということが大事で、小さすぎるかな、というところまでできたところがちょうどよいサイズ、といえます。