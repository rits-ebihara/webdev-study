# Jest のレシピ

Jest を使ったテストを書くときに、さまざまな問題にぶち当たる事が多いので、その解決方法をここにメモする。

## Jest とは

まずは、ここ。

https://jestjs.io/ja/docs/getting-started

## モック

### 基本

#### Spy と Stub(スタブ)についての理解

spy: 関数の実行を監視する。関数の処理は変更しない。何回実行したか、引数に何が渡ったか、何を返したかを記録する。
stub: 関数の処理内容を上書きして、テストの都合に合わせて任意の処理、戻り値を変更する。

テスト対象外と鳴る外部のモジュールを spy とするか、stub とするか、を考えるべきだけど 殆どの場合合わせて使うことが多いと思う。

jest でもやはり どっちの機能も合わせてもたせる事が簡単にできる。これをここでは モック と呼ぶ。

jest では、stub を作ると、spy がついてくる感じ。

モック を作るには、`jest.mock()`, `jest.spyOn()` とある。

#### jest.mock か jest.spyOn か

`jest.mock()` を使うと、対象のファイルの export した関数がすべて　モック関数になる・・・が、多くは値を返すものが多く、stub を作成することが多い。

であれば、はじめから `jest.spyOn()` を使ったほうが良いと思う。stub から実際の実装に戻すこともできるし。

### モック関数

`jest.fn()` とすると、モック関数を作成できる。`spyOn` でモック化した関数と同じように、評価で使用できる。

モックの実装（処理や戻り値）を定義することもできる。

テスト対象が、コールバック関数を引数として要求しており、それが正しく実行されるか、といった評価する場合にモック関数を作成して渡す。

https://jestjs.io/ja/docs/mock-functions

### テスト毎に stub を変えたい場合

モックの変更は、jest.fn() .mockImplementation などでできる。TypeScript では、`ts-jest` の `mocked`でラップする。その場合でもモック関数でないとテスト実行時にエラーになる。

https://jestjs.io/ja/docs/mock-function-api

Once がついたものは、1回だけその実装で、それ以降はもとのモック実証の処理に戻るので、一時的に変えると気には便利。

### Export された関数

モック対象のファイル

```ts
const getUserName = (user: IUser) => {
  //  ユーザーを返す処理
};
export default getUserName
```

```ts
import * as users from './users';

jest
  .spyOn(users, 'getCurrentUser')
  .mockImplementation(() => ({ localName: 'test-user' } as any));
```

spyOn には、オブジェクトを指定する必要があるため、`import * as` を利用することになる。

### Default Export された関数

モック対象のファイル

```ts
const getUserName = (user: IUser) => {
  //  ユーザーを返す処理
};
```

```ts
import * as users from './users';

jest
  .spyOn(users, 'getCurrentUser')
  .mockImplementation(() => ({ localName: 'test-user' }));
```

### ライブラリの一部だけモック化したい



### クラスのモック

### 非同期関数のモック

### 評価が必要な関数を返す関数のモック

### メソッドチェーンな関数のモック

## React Component のテスト

### 検査対象ファイル内の関数のモック化

- export する
  - __private などのオブジェクトにまとめるのが良い

- rewire を利用する

### 基本

- @testing-library/react を使う

### モック

#### 外部コンポーネントのモック


### useContext のモック化

- useContext 自体をモック化する
  - MUI などそれに依存するライブラリが死ぬ
  - それらも含めてモック化する
- Provider をモック化して、useContext 自体はモック化しない
  - いい感じ

### react-redux

- useSelector をモック化する

### 疑似レンダリング

#### useEffect での非同期処理

- waitFor で待つ

#### イベントを発生させる

### 評価

#### 外部コンポーネントのモックへ渡したコールバック関数の確認

#### 要素の取得

#### querySelector

#### あるはずなのに見つからないとき

- 外部コンポーネントの場合、属性がそのままレンダリングされるとは限らない。
  - 例えば、data-testid がレンダリングされていない
  - MUI のフォーム部品など出力されるHTMLが想定と異なることも
  - 出力された HTML を確認する
- document のルートに配置される　MUI のダイアログなど
  - document.body が参照できるので、そこから querySelector で取得する
