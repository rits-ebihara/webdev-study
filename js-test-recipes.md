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

モック対象のファイルで、export default されている関数は、

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

jest.requireActual で、モジュールの実装を取得できる。

```ts
jest.mock('@material-ui/core/styles', () => ({
  ...(jest.requireActual('@material-ui/core/styles') as object),
  // モック化する関数だけを記載
}));
```

### クラスのモック

クラス全体をモック化したいときは、jest.mock を使う。メソッドはすべて jest.fn となる。

モック化対象クラス

```ts
export class User {
  constructor(name: string) {
    this.name = name;
  }
  public name: string;
  public callUser() {
    return `${this.name} さん、こんにちは`;
  }
```

テスト対象

```ts
import { User } from './User';

export const fn = (name: string) => {
  const user = new User(name);
  return user.callUser();
};
```

```ts
jest.mock('../User');
```

その中のメソッドで、戻り値を返したい場合など、モックをカスタマイズする場合、クラスのインスタンスとなるオブジェクトを定義し、クラスをそれを返す関数(コンストラクタ関数にもなる)としてモック化する。

```ts
import { fn } from '../target';
import { User } from '../User';

const mockUser = {
  callUser: jest.fn()
};

jest.mock('../User', () => ({
  User: jest.fn(() => mockUser),
}));

test('call user', () => {
  const res = fn('ebihara');
  expect(User).toBeCalledWith('ebihara'); // コンストラクタ関数の実行確認
  expect(res).toBe('return callUser.'); // 戻り値が、callUser が返す値をそのまま返しているか
});
```

### 非同期関数のモック

1. Promise を返すか async の関数を定義してをモックとして定義する方法。

    ```ts
    // 非同期で、'result' を返す関数
    const afn = jest.fn(async () => 'result');
    ```

1.  jest.fn の、`mockResolvedValue(Once)` を使う方法

    ```ts
    // 非同期で、'result' を返す関数
    const afn = jest.fn().mockResolvedValue('result')
    ```

### 例外を返す非同期関数のモック

1. Promise を返すか async の関数を定義してをモックとして定義する方法。

    ```ts
    const error = new Error();
    const afn = jest.fn(async () => { throw error });
    ```

1.  jest.fn の、`mockRejectedValue(Once)` を使う方法

    ```ts
    const error = new Error();
    const afn = jest.fn().mockRejectedValue(error)
    ```

いずれも、catch で、error が引き渡される。

### メソッドチェーンな関数のモック

オブジェクトの関数の戻り値に、自身のオブジェクトを返すことで、メソッドチェーンで記述できる物も多いです。

例えばHTTP クライアントである、`superagent` では、下記のような記述をします。

```ts
import superagent from 'superagent';
const result = await superagent
  .post('/api/pet')
  .set('X-API-Key', 'foobar')
  .set('accept', 'json');
  .send({ name: 'Manny', species: 'cat' }); // sends a JSON post body
```

これをモック化するには、mockReturnThis を使うことで簡単に記載できる。

```ts
const agent = {
  post: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  send: jest.fn().mockResolvedValue({ body: { result: true } }),
};
jest.mock('superagent', () => agent);
```

### exportされていない関数のモック化やテスト

通常は export されていない関数をモックにすることはあまりない。

複雑な処理の場合、モック化することで単純化できる。もちろん、その関数のテストも何らかの形で行う必要はある。

- export する
  - __private などのオブジェクトにまとめる

- rewire を利用する

[TypeScript jest exportしていない関数・変数のテスト - golangの日記](https://golang.hateblo.jp/entry/2021/03/12/214524)

## 評価

jest での評価は、expect を使用する。

```ts
expect(現実値).XXX(期待値)
```

* XXX には、評価方法のメソッド名が入る。

### プリミティブ値の検証

文字列や数値などのプリミティブ型の値については、評価方法 `toBe` を使う。

```ts
expect(actual).toBe('期待値');
```

boolean でも `toBe` で良いけど、メソッドでも用意されている。

```ts
expect(actual).toBeTruthy(); // actual が true の場合成功
expect(actual).toBeFalsy(); // actual が false の場合成功
```
### オブジェクトの検証

`toBe` は、`Object.is` で比較するもので、オブジェクトの内容が一緒でも別なオブジェクトであれば false になってしまう。

オブジェクトの内容が一致することを確認するには、`toEqual` を利用する。

```ts
expect(actual).toEqual({ name: 'ebihara' });
```

### オブジェクトの部分的な検証

オブジェクトが長大な場合などは、全部の項目を確認するのではなく、一部だけ一致していれば良い、という検証を行う場合もある。

その場合は、`expect.objectContaining` を利用する。

```ts
expect(actual).toEqual(
  expect.objectContaining({ name: 'ebihara' }),
);
```

## React Component のテスト

### 基本

@testing-library/react を使う。

snapshot も取れて、要素の取得やイベントの発火も簡単で、react hooks にも対応していて、レンダリングのタイミングをあまり気にしなくても良い。

### React 関連のモック

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
