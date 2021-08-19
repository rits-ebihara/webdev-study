# 言語 - ES20xx / TypeScript

筆者: 海老原 賢次（kenji.ebihara@jrits.ricoh.co.jp）  
作成日: 2021-08-18  
更新履歴:

- 2021-08-18: 新規作成

## 概要

ここでは、JavaScript の言語規格である ECMAScript と TypeScript について書いています。

また、JavaScript は、ECMAScript のバージョンアップに合わせてその機能も追加されているので、最新の仕様についても述べます。

## ECMAScript

JavaScript は、Webブラウザの黎明期に Netscape というブラウザに搭載されたのが始まります。

そのあとIEや他のブラウザでも採用され、Flash のスクリプトや Windowsのシェルとしても採用されました。

しかし、それぞれ独自の仕様が追加されたり、同じ名前のメソッドでも動作が異なるなど、かなり混乱した時代がありました。

そのため、ECMAScript としして標準の規格を作ることとなりました。ECMAScript は、規格の定義であり、いわば仕様書のようなものです。言語では有りません。

現在のブラウザでは、この ECMAScript の仕様に従って作成されており、ブラウザ間の差異はかなり少なくなりました。しかし、ECMAScript は毎年更新され、各ブラウザはそれに追いつこうとしていますが、ややばらつきがあります。特に新しいの仕様については注意が必要です。

ブラウザの対応状況は、下記のページで確認できます。

[ECMAScript 2016+ compatibility table](http://kangax.github.io/compat-table/es2016plus/)

ECMAScript のバージョンは、2015年以前は ES6 などの番号が、2015年移行は ES2020 など発行年が付きます。

Node.js は、ECMAScript に比較的早い段階で対応されるので、最新の仕様を試したい場合には良いと思います。

[ECMAScript 2015 (ES6) とそれ以降のバージョン | Node.js](https://nodejs.org/ja/docs/es6/)

## TypeScript

JavaScript は、軽量なオブジェクト指向言語です。軽量なので、すぐに作って試す、ということができますが、規模が大きくなるとそれが欠点となり、安全性（バグの生みやすさ）やメンテナンス性が非常に低下します。

TypeScript は、Alterative JavaScript 言語と呼ばれるもので、大規模アプリでも適用できるようにしたものです。

TypeScript の仕様で書いたコードを、JavaScript にコンパイル（変換）して使用します。

ざっくりと、下記のような特徴があります。

1. TypeScriptではJavaScriptと同様の構文が使える

    TypeScript は、ECMAScript の仕様に型定義などの独自仕様を追加したものになっています。ですので、JavaScript で書いたコードは、そのまま TypeScript にもなります。  
    このことで、開発者の学習コストは大きく有りません。

2. JavaScriptは動的型付け、TypeScriptは静的型付け

    TypeScript は、厳密に型チェックされます。例えば、文字列を入れた変数に、数値を入れることはできません。（コンパイルエラーになります）  
    また、Null Safety にも書けるので、よくある null / undefined のエラーも低減できます。

3. コンパイラを通すので、事前に構文チェックが行える

    上に書いたような間違いは、JavaScriptでは実行時でないとわかりませんし、それだけではエラーにもならないので、原因の追跡が難しい場合が多いです。  
    TypeScript は、コンパイル時にそういったものをエラーとして検知するので、事前に判明できるので、安全なコーディングができます。

4. TypeScriptではインターフェースなど型定義の作成ができる

    型定義として、JavaScript のビルドインのタイプだけでなく、Java や C# のようなインターフェースの定義ができます。  
    変数で、インターフェースが割り当てられると、

ES20xx を　ES5（古いブラウザ対応）に変換（トランスパイル）したり、モジュールをバンドルする機能はないので、Webブラウザアプリの場合は webpack などで解決する必要があります。

厳密な型定義がされることで、バグを未然に防ぐことができるとともに、エディタの入力支援を受けやすくもなります。これの有無によって開発効率が大きく変わります。

## 演習

### ECMAScript

ECMAScript で大きく変わった、ES2015以降の仕様について、確認していきましょう。

#### 変数と定数

JavaScriptでは変数の宣言は、`var` でしたが、`let`, `const` が追加されました。

これにより、`var` の仕様は非推奨になっています。

`let` は、値を入れ替えることができる変数、`const` は入れ替えられない変数です。

意外かもしれませんが、殆どの場合 `const` で賄えます。基本的には`const`を使い、必要な場合に `let` を使う、のが推奨されています。ESLint でもそういったルールがデフォルトになっています。

勘違いしやすいのは、`const`で定義したオブジェクトのプロパティの値は変えられる、ということです。これは、オブジェクト自体は同じもの、だからです。ちなみに、内容が全く一緒だけど別に定義したオブジェクトは同一ではないので、代入できません。

```js
let l = "a";
l = "b"; // 👍 OK

const c = "a";
c = "b"; // ❌ エラー

const o = { name: "ebihara" };
o.name = "kenji"; // 👍 OK
o = { name: "kenji" }; // ❌ NG
```

#### arrow関数

関数は、function を使って定義しますが、下記のような書き方ができるようになりました。

```js
function hoge(a) {
  console.log(a);
}

const hoge = (a) => {
  console.log(a)
};
```

JavaScript では、Function はオブジェクトの扱いなので、変数のように関数の引数に指定できたりします。Arrow関数のほうがそのことが直感的にわかりやすいと思います。

この2つは **ほぼ** 同じですが、'this' の取り扱いが異なるので、注意です。

通常の function だと、呼び出し⽅によって 'this' の内容が異なります。

arrow 関数であれば、this は書いたところの 'this' に拘束される。

arrow 関数のほうが、わかりやすいので function はできるだけ 使わない ほうが良いですが、オブジェクトのメソッド（後述するクラスも同様）に関しては、this の取り扱いは function でないと正しく有りません。

```js
// 👍 正しい
const o = {
  name: 'hoga',
  setName(s) { this.name = s },
}
o.setName('fuga');
console.log(o.name); // -> 'fuga';

// ❌ NG
const o = {
  name: 'hoga',
  setName: (s) => { this.name = s },
}
o.setName('fuga');
console.log(o.name); // -> 'hoge';
// このときの this は、グローバルの this = window になります。
console.log(window.name); // -> 'fuga';
```

#### テンプレートリテラル

⽂字列リテラルとして、 '"ダブルクォーテーション"' と ''シングルクォーテーション'' が使われます。

これに加え、 '`バッククォート`' も⽂字列リテラルとして利⽤できるようになりましたが、これは、改行を含んだり、内部で変数を埋め込んで展開できるようになりました。

```js
let name = 'ebihara kenji';
let date = new Date();
console.log(`こんにちは! ${name} さん!`); // -> こんにちは! ebihara kenji さん!
console.log(`今は ${date.toString()} です。 `); // -> 今は Tue Jun 12 2018 12:58:17 GMT+0900 です。
// 改行もいける
console.log(`今は
${date.toString()}
です。 `);
// ↓
// 今は
// Wed Jun 13 2018 14:34:43 GMT+0900 (東京 (標準時))
// です。
// エスケープしないで出力する
console.log(String.raw`改行は\nでできます`);
// 改行は\nで返されます。
```

最後の記述は、 タグ付きテンプレート と⾔われるものです。String.raw は関数です。

ここでは詳細は説明しませんが、ライブラリではこの呼び方をすることも有るので、こういう書き方も有る、と覚えておいてください。

[テンプレートリテラル (テンプレート文字列) - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)

#### デフォルト引数

関数の引数の宣⾔で、引数が指定されないときのデフォルト値を指定できるようになりました。

```js
const hello = (name, keisho='さん') => {
console.log(`ようこそ ${name} ${keisho}`);
}
hello('kenji'); // -> ようこそ kenji さん
```

#### 可変⻑引数

関数の引数で、可変の数の引数を宣⾔できるようになりました。ただし、他の引数の最後に指定する必要があります。

```js
const hello = (name, ...keisho) => {
  keisho.forEach(a => {
      console.log(`ようこそ ${name} ${a}`);
  });
}
hello('kenji', 'さん', 'さま', 'くん');
// ようこそ kenji さん
// ようこそ kenji さま
// ようこそ kenji くん
```

#### オブジェクトの分割代⼊

オブジェクト内のプロパティをそのプロパティと同じ名前のローカル変数で参照する場合、簡単に書くことができます。また、プロパティが undefined の場合の初期値も定義できます。

```js
const user = {
  name: 'kenji ebihara',
  age: 29,
  address: 'yoshino-cho kagosima-ken',
};
const {name, age=-1, gender="unknown"} = user;
console.log(name); // -> kenji ebihara
console.log(age); // -> 29
console.log(gender); // -> unknown 
```

配列でも同様に受け取ることができます。

```js
const [first, second] = ['a', 'b', 'c']
console.log(`${first}, ${second}`); // "a, b"
```

#### スプレッド構文（オブジェクトの展開）

オブジェクト内のプロパティを、"..."で同じ名前の変数にすべて展開できます。

展開した内容は1階層コピー（いわゆるシャローコピー）で、オブジェクトが含まれる場合、そのオブジェクトはコピー元と同じものが参照さるので、注意が必要です。

```js
const user = {
  name: 'kenji ebihara',
  age: 29,
  address: 'yoshino-cho kagosima-ken',
};
const assignUser = {
  ...user,
  assignData: new Date(),
}
console.log(assignUser);
/*
{
  "name": "kenji ebihara",
  "age": 29,
  "address": "yoshino-cho kagosima-ken",
  "assignData": "2018-06-12T04:39:46.354Z"
}
*/
```

配列でも同様のことができます。配列のマージや同じ値を持つ別の配列を作成するときなどに便利です。

```js
const abc = ['a', 'b', 'c'];
const a123 = ['1', '2', '3', ...abc];
console.log(a123); // -> [ "1", "2", "3", "a", "b", "c" ]
```

#### クラス定義

function でコンストラクタ関数として書くことにより、クラスっぽい事はできました。

しかし、特別な宣⾔もなく通常の関数との違いがわからないことから、誤って通常関数のように使ってしま
うと、エラーになるならまだしも、場合によってはエラーにもならず変な動作をしてしまうこともあり得
ます。

class ステートメントが追加されたことで、これを利⽤するようにしましょう。

ただしJavaやC#異なり、プロパティはコンストラクタの中で定義します。

```js
class Polygon {
// height = 0 // こんな事はできない
// コンストラクタ
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  // getter
  get area() {
    return this.#calcArea();
  }
  // private メンバには '#' を付ける
  #calcArea() {
    return this.height * this.width;
  }
}
let square = new Polygon(10, 10);
console.log(square.area);
// 100
```

#### オプショナル・チェイニング演算子

オブジェクトのプロパティを参照したい場合、オブジェクト自身が null / undefined の判断をすることは多いかと思います。

そのプロパティがオブジェクトで、null / undefined の可能性がある場合、さらにその判断をすることになりますが、if が冗長的になります。

```js
let name = '';
if (session) {
  if (session.user) {
    name = obj.user.name;
  }
}
```

オプショナル・チェイニング演算子を使用すると、完結に書くことができます。

```js
const name = obj?.user?.name; // obj か、obj.user が null/undefined の場合、undefined を返します。
```

#### Promise / async / await

Promise は非同期処理関数で使用されるオブジェクトです。

Promise 以前は、非同期処理が完了したときの関数（コールバック関数）を引数で渡していました。

ある非同期関数の後に別の非同期関数を実行する、ということも少なくなく、このような場合コールバック関数が入れ子になってしまい、コードの見通しが非常に悪くなります。俗にコールバック関数地獄、と言われています。

```js
asyncFn1((data1) => {
    asyncFn2((data2) => {
        asyncFn3((data3) => {
            asyncFn4((data4) => {
                //処理
            });
        });
    }); 
});
```

非同期関数が、Promise オブジェクトを返すように改善すると、下記のようにメソッド・チェーンの形で書くことができます。

```js
asyncFn1()
  .then((data1) => { return asyncFn2(); })
  .then((data2) => { return asyncFn3(); })
  .then((data3) => { return asyncFn4(); })
  .then((data4) => { /* 処理 */  })
  .catch((e) => {
    /* 上のいずれかで例外が発生した場合に、catch が処理される */
  });
```

Promise を返す非同期関数を作成するには、new Promise としてPromiseオブジェクトを作成します。引数に処理の関数を定義します。成功時には resolve（関数の第1引数）、失敗時に reject（関数の第2に引数） を実行します。 

```js
const asyncFn1 = () => {
  return new Promise((resolve, reject) => {
    let result = true;
    // 何かしらの処理
    if (result) { // result は何かしらの処理の結果が入っていることと仮定する
      resolve(result); // 引数に与えたオブジェクトを非同期関数の戻り値となる
    } else {
      reject(new Error('エラーが発生しました')); // reject が呼ばれると、呼び元の catch が処理される。
    }
  })
};
```

async / await は、メソッドチェーンの形ではない、非同期処理関数を実行する書き方です。

```js
// await を使用するには、その関数が async 宣言されている必要がある。
// async 宣言した関数は、自動的に Promise を返す非同期関数となる。
const fn = async () => {
  try { // 非同期処理の例外(reject)は、try ~ catch で処理できる
    const result = await asyncFn1(); // resolve で渡された値が result に入る
    // await があると asyncFn1 が終了するまで、次の処理に進まない。
    // asyncFn1 完了後の処理
    // ...
    return obj; // return した値が、非同期関数の戻り値となる。Promise での resolve と同じ
  } catch (e) {
    throw e;
  }
};
```

#### 配列のメソッドの拡張

配列（Array) を順次に処理する場合、for を使うことが多いでしょう。ES2015 以降では、配列のメソッドが拡張され、関数で順次処理を書くことができるようになっています。

ここではその一部を紹介します。

```js
const users = [
  { age: 10, name: 'taro'},
  { age: 20, name: 'jiro'},
  { age: 30, name: 'hanako'},
];

// age が20以上のオブジェクトを抜き出す

const over20 = users.filter((user) => user >= 20); // (user) => { return user >= 20 } と同じ意味です
console.log(over20); // [  { age: 20, name: 'jiro'},  { age: 30, name: 'hanako'} ]

// 条件にあったものを１つ抽出する

const taroUser = users.find((user) => user.name === 'taro');
console.log(taroUser); // { age: 10, name: 'taro'}

// 配列内に条件に合うものが含まれるかどうか

const exist = users.includes((user) => user.name === 'saburo');
console.log(exist); // false

// 配列から、別の配列を生成する。

const displayList = users.map((user) => `名前:${user.name} / 年齢:${user.age}`);
console.log(displayList); // ["名前:taro / 年齢:10", "名前:jiro / 年齢:20", "名前:hanako / 年齢:30"]

// 配列の値を蓄積して、単一の戻り値を返す

const nameChain = users.reduce((accumulator, user) => `${accumulator} / [${user.name}]` );
console.log(nameChain); // "/ [jiro] / [hanako]"

// インデックスを使って配列の一部を抜き出す（元の配列に変化はない）

const a2 = users.slice(1, 2); // インデックス 1 から インデックス 2 までを取り出す
console.log(a2); // [{ age: 20, name: "jiro" }, { age: 30, name: "hanako" }]
const last = users.slice(-1); // 最後の1つ目 から 1つ取り出す = 配列の最後の項目だけ取り出す
console.log(last); // [{ age: 30, name: "hanako" }]

// 配列を順次処理する

users.forEach((user) => {
  // user を使った処理
  console.log(user);
})

// 以下は破壊的メソッド
// 配列の指定したインデックスに要素を追加する
users.splice(1, 0, { age: 40, name: 'saburo'});
console.log(user); // [{"age":10,"name":"taro"},{"age":40,"name":"saburo"},{"age":20,"name":"jiro"},{"age":30,"name":"hanako"}]
// 配列から指定したインデックスを削除する
users.splice(2, 1);
console.log(user); // [{"age":10,"name":"taro"},{"age":40,"name":"saburo"}, {"age":30,"name":"hanako"}]
```

#### 末尾のカンマ

オブジェクトリテラルや配列リテラル、関数の引数で、最後の項⽬の後にカンマが付けられます。

後に要素を⾜したり、順番を⼊れ替えたりするときに、カンマを付けたり取ったりする⼿間が省かれるでなるべくつけておくのが良いと思います。

eslint などでは必須のルールとすることができます。

```js
let obj = {
name: 'ebihara',
age: 29, // OK
};
let arr = [ 1, 2, 3, ]; // これもOK
let fn = (a, b, c,) { /* ... */ } // 仕様上はOKだが、対応ブラウザが限られる
```

### TypeScript

TypeScript は、最新の ECMAScript の対応を積極的に行っているので、上で挙げた ECMAScript の仕様はそのまま使えます。

これに加えて、型定義に関する様々な仕様が追加されています。

#### 変数の型指定

let や const の変数に型を指定できます。型違反の代入は、コンパイル時にエラーになります。

```ts
let num: number = 0;
const str: string = "aa";
str = 0; // エラー
```

関数の引数や戻り値にも型を指定できます。

```ts
const fn = (num: number): string => {
  return `num:${num}`;　OK // string でない return だとエラー
};
const result = fn("0"); // 引数の型が違うためエラー
console.log(result.length); // result は文字列であることが確定しているため、安心して .length が使える
```

#### Union型

JavaScript では、変数に文字が入ったり数値が入ったり、といったように複数の型を取ることがあります。

そのような場合は、Union 型が利用できます。

プロパティは共通のものがあればそのまま利用できますが、

```ts
const getYear = (date: Date | number) => {
  console.log(date.toString()); // toString は Date, number どちらも持っているのでキャストが必要ない
  // console.log(date.getFullYear()); // number に getYear がないのでエラー 型チェックかキャストが必要
  if (typeof date === "number") {
    const d = new Date();
    d.setTime(date);　 // 型チェックにより、date は number に確定している
    return d.getFullYear()
  } else {
    return date.getFullYear(); // 型チェックにより、date は、Date に確定している
  }
}
``` 

#### 文字列リテラル型

ある変数は文字列だけど入る文字列の種類は決まっている、という場合が多いです。

例えば、ステータスを表す情報として、'create','processing','complete' と決まっているという場合などです。

これは、文字列リテラル型の Union型 として定義できます。

```ts
let status: 'create' | 'processing' | 'complete' = 'create';
status = 'procesing'; // エラー タイプミスを防ぐことができる
```

文字列だけでなく、数値もいけます。

```ts
let status: 0 | 1 | 2 = 0;
status = 3; // エラー
```

#### オブジェクト型

Java や C# のように、オブジェクトの型（interface）を定義できます。

interface 構文と、type 構文があります。

```ts
interface User {
  name: string;
  age: number;
}
type UserType = {
  name: string;
  age: number;
};
const user: User = {
  // 宣言しているプロパティがなかったり、宣言にないプロパティがあるとエラー
  name: 'ebihara',
  age: "47", // 型違反によりエラー
  address: "", // オブエクト型にないプロパティなのでエラー
};
// type で宣言した方も同様に使える
const tUser: UserType =  {
  name: 'ebihara',
  age: 47,
};
```

interface と type の違いですが、できることはほとんど同じです。interface は、extends で拡張できるアドバンテージがありましたが、type でも型のマージをすることで拡張と同じようなことができるようになりました。

```ts
interface User {
  name: string;
  age: number;
}
type UserType = {
  name: string;
  age: number;
};

interface ExUser extends User { // User を拡張
  address?: string;
}

type ExUserType = UserType & { // 型をマージ
  address?: string;
};

const user: ExUser = {
  name: 'ebihara',
  age: 47,
  address: "kagoshima",
};
// type で宣言した方も同様に使える
const tUser: ExUserType =  {
  name: 'ebihara',
  age: 47,
  address: "kagoshima",
};
```

override について、interface は 親のプロパティの型を変更できないなど厳密ですが、type の方が単純な上書きなのでルーズな拡張になります。

また、type では Union型 や 後述する、関数型 も定義できます。

```ts
type date = Date | string;
type FnType = (date: Date | number) => string;
```

Java のように厳密に管理したい場合は、interface が良いですが、最近では扱いが楽な type を好む人が多いようです。

筆者も、Java と似たような管理ができる interface を使用していましたが、最近では type を多用するようになりました。

[interfaceとtypeの違い、そして何を使うべきかについて](https://zenn.dev/luvmini511/articles/6c6f69481c2d17#3.-%E3%81%A9%E3%81%A1%E3%82%89%E3%82%92%E4%BD%BF%E3%81%86%EF%BC%9F)

#### 関数型

関数自体も型定義できます。関数の型とは、引数の数とそれぞれの型と関数の戻り値です。

コールバック関数を持つ汎用的な関数を作成するときなどに便利です。

```ts
type CallBackFnType = (date: Date | number) => string;

const fn: FnType = (date) => { // 引数の指定をしなくても型定義により指定されているので必要ない
  return date.toString(); // string をreturn しないと エラーとなる。
};
```

#### 型推論

型指定しなくても、変数の宣言時に代入した型から、変数の型を自動的に判別します。

オブジェクトリテラルについても、プロパティとそれぞれの型が自動判別されます。

```ts
let n = 0;
n = "1"; // エラー n は数値型になっている

const user = { name: 'ebiahra', age: 47 };
user.name = 1; // エラー name は文字列のため
user.address = ""; // エラー address プロパティはないため
```

#### 文字列インデクサ

v["key"] のようにしてメンバにアクセスできる型を宣⾔できる。JavaのMap型のようなもの。

```ts
const status: {[code: string]: string} = {
'00': '初期',
'10': '申請中',
'20': '承認済',
};
status['30'] = '廃棄';
console.log(status['00']); // -> "初期"
```

#### クラス

ES20xx で説明したクラスが、TypeScript でも使えますが、より使いやすくなっています。

```ts
class User {
  // constructor 外での初期化が可能
  familyName = '';
  givenName = '';
  age: number | null = null;
  gender: 'male' | 'female' | null = null;
  constructor() {
    // 初期化処理
  }
  public getDisplayName () {
    return `${this.familyName} ${this.givenName}`;
  }
  private lastAccessDate: Date | null = null; // 外からアクセスできない
  public setLastAccessDate(date: Date) { // 明示的に公開
    this.lastAccessDate = date;
  }
  public readonly authority: string = "admin"; // 読み取り専用で公開
}
```

#### ジェネリック型

ジェネリック型は、クラスやオブジェクト、関数に外部から型を与えられる事ができる機能です。

Java や C# などでも同様の機能があります。

この機能は、汎用的なユーティリティなどを作るときに便利です。

例えばこのコードは、リングバッファを実現するクラスですが、バッファとして管理する値は、使う側が決めるようにするものです。

```ts
class RingBuffer<T> {
  private buffer: T[] = [];
  private bufferSize = 100;
  public currentIndex = -1;
  public constructor(){
    this.buffer = Array(100);
  }
  public push(value: T) { // 配列に追加する T のオブジェクトを渡す
    // カレントが終端の場合は、先頭に戻る
    this.currentIndex++;
    if (this.currentIndex > this.bufferSize) {
      this.currentIndex = 0;
    }
    this.buffer[this.currentIndex] = value;
  }
  public getCurrent() {
    return this.buffer[this.currentIndex]; // T オブジェクトが返る
  }
}

type UserType = {
  name: string;
  age: number;
};

const ringBuffer = new RingBuffer<UserType>();

ringBuffer.push({
  age: "20", // エラー ジェネリック型に指定した型とことなる
  name: 'taro',
});
```

#### タプル型

通常配列は、その中の値は単一の型のオブジェクトであることが望ましいです。

ただ、例えば関数の戻り値で、複数の値を返したい場合、オブジェクトでも良いのですが、数が少ない場合、配列として1番目に文字列、2番めに数値 など決まった数と順番で返すようにすると、便利です。

そのように、配列の数と順番が決まっている場合、それを型として定義できます。それをタプル型といいます。

```ts
const createLog = (message: string): [Date, string] => {
  return [new Date(), `S:${message}`]
};
const [date, message] = createLog('test');
console.log(date.toISOString); // -> ISO8601 形式日付 
console.log(message); // -> "S:test"
```

#### Utility Types

これは純粋な型ではなく、定義されている型を元に、変更した別の型を生成するものです。

[【TypeScript】Utility Typesをまとめて理解する - Qiita](https://qiita.com/k-penguin-sato/items/e2791d7a57e96f6144e5)

Omit や Partial がよく使われます。

Omit は指定したプロパティを削除します。Partial は全てのプロパティをOptional（undefined の可能性がある = なくても良い）にします。

```ts
type UserType = {
  name: string;
  age: number;
};

type AgeOnly = Omit<UserType, 'name'>; // { age: number } だけの型となる

type PartialUser = Partial<UserType>; // { name?: string, age?: string } となります

```
