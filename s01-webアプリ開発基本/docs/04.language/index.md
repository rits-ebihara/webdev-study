# 言語 - ES20xx / TypeScript

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
