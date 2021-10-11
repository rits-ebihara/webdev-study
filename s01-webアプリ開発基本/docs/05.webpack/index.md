# タスクランナー/モジュールバンドラ: Webpack

筆者: 海老原 賢次（kenji.ebihara@jrits.ricoh.co.jp）  
作成日: 2021-08-20
更新履歴:

- 2021-08-18: 新規作成

## 概要

webpack は、モジュールバンドラと呼ばれるツールで、複数の JavaScript ファイルで構成されるプログラムを1つ（複数に応じて複数）にマージするものです。

ES2015 以前のJavaScript には、他のファイルを参照する（Java でいうところの import）がありませんでした。そこで、それを独自の形式で実現するいくつかのツールが使われていました。CommonJS や AMD などの名前が知られています。

ES2015 で、import / export 構文により、他のファイルを参照できるようになり、Node.js ではファイルをマージしなくても、そのままで実行できます。

ブラウザでも ES20xx の対応が進んでおり import / export にも対応しています。JavaScript ファイルに import がある場合、自動的にファイルをダウンロードしてくれます。

ただ、npm で導入したパッケージの参照が解決できないですし、画像やCSSファイルなどもJavaScript化して 同梱できたり、webpack のビルドシステムとしての機能も手放せません。

また、ファイルが多数になると、パフォーマンスにも影響します。

これらの課題は、将来解決されると思いますが、2021年度現在では webpack を使うのがスタンダードとなっています。

## ローダーとプラグイン

ローダーとは、ファイルの種類ごとの変換処理をおこなうもので、必要に応じてwebpack とは別に導入します。

よく使われるローダーとしては、下記のようなものがあります。

- babel-loader: ES2015 以降のコードで書かれた JavaScript を ES5 形式のコードに変換する
- ts-loader: TypeScript から JavaScript への変換を行う
- css-loader: CSSファイルに書かれたものを、JavaScript ファイルに変換する。
- sass-loader: sass形式のファイルを、JavaScript ファイルに変換する。

プラグインは、変換処理以外の処理、ファイルの移動などの動作をするためのものです。

- html-webpack-plugin: webpack が出力したJSファイルを参照する&lt;script&gt;タグを挿入し、出力します。
- webpack-dev-server: 開発用の簡易のWebサーバーを起動できます。

## インストールと設定

ここでは、TypeScript のビルドをモジュールバンドルを試してみましょう。

まず webpack をインストールします。プロジェクトフォルダに見立てた空フォルダを作成します。[package-manager](../02.package-manager/index.md) の章で作成下フォルダでもいいです。

空フォルダを作成した場合は、`npm init` を実行します。

webpack も npm のライブラリとして導入します。CLIコマンドとして実行するので、webpack-cli も一緒に導入します。

開発環境で使い物なので、 -D をつけましょう。

```
yarn add -D webpack webpack-cli
```

webpack を動作するには、各種設定を記述した `webpack.config.js` ファイルが必要です。

設定ファイルなのですが、JavaScript のコードとして書きます。

リファレンスを見ながら書いていってもいいのですが、ここでは `yarn webpack init` コマンドを実行して、ウィザード形式で作ってみます。

と叩くと、`@webpack-cli/generators` が必要だと言われます。`Y`を押してもいいのですが、yarn を使っているので、ここでは `n` としておきます。

```
yarn add -D @webpack-cli/generators
```

改めて、`yarn webpack init` を実行します。

```bash
yarn webpack init

? Which of the following JS solutions do you want to use? Typescript # TypeScript を使う
? Do you want to use webpack-dev-server? Yes # 開発用のローカルのWebサーバーを使う
? Do you want to simplify the creation of HTML files for your bundle? Yes # HTMLファイルを生成する
? Do you want to add PWA support? No # PWA(プログレッシブ Web アプリケーション) をサポートするか
? Which of the following CSS solutions do you want to use? none # CSS(sass なども含む)to JS を行うか
? Do you like to install prettier to format generated configuration? No # prettier の導入を行うか
? Pick a package manager: yarn # npm or yarn どちらを使うか
[webpack-cli] ℹ INFO  Initialising project...
 conflict package.json
? Overwrite package.json? overwrite # 'y'を選ぶと 'overwrite'
```

処理が終わると、`webpack.config.js` ファイルが出来ていると思います。

開いて中を確認してみましょう。ポイントだけ説明します。

`entry` とあるのは、webpack がはじめに読み込むファイルです。このファイルの中に書かれている `import` のファイルをたどって順次処理をしていきます。

つまり、ほかから全く参照されないファイルは、この `entry` に書かれない限り対象とならない、ということになります。

`entry` は、配列にして複数のファイルを指定することも出来ます。その場合、`entry` ごとにマージされたファイルが作成されます。

`output` ファイルは、出力するファイルパスを指定します。`path` はディレクトリ名になります。これだけでも良いのですが、ファイル名を指定することも出来ます。指定しない場合は、`main.js` となります。`entry` が複数ある場合は、`entry` 名がファイル名に付きます。

`devServer` は、ローカルで動作するWebサーバーの動作環境の設定です。

`plugins` には、WebPack に導入するプラグインの初期化と設定を行います。  
ここで指定している HTMLWebpackPlugin は、雛形のHTMLファイルに 出力される JavaScript を参照する Script タグを追加して、`output` のフォルダに出力するものです。

`module` の `rules` には、拡張子毎にどのローダーを利用するかを設定します。

最後の、`isProduction` で判断している箇所ですが、これは `mode` の値を設定しています。  
`mode` は、バンドルされたJavaScriptをコードが見やすい形に出力するか、minify してなるべく小さくなるように出力するかの違いです。

`development` とすると見やすい形に、`production`とすると minify されます。

`package.json` を見てみると、script が追加されています。webpack の実行は、このスクリプトを使うと良いでしょう。

また`name`の値も変わってしまっているので、注意してください。

## 動作確認

実際にコードを書いてバンドルしてみます。

まずは、`webpack init` ですでに index.ts が作成されていますので、これを webpack にかけてみます。  
内容は、`console.log`が1行あるだけです。

webpackを実行するには、

```
yarn build:dev
```

dist フォルダが作成されました。`index.html` と `main.js` が生成されています。

`main.js` を見てみると、なにやら書かれていますが、ブラウザでHTMLを確認してみましょう。

開発用の Webサーバーを起動します。

```
yarn serve
```

Hello World! と出ています。F12 キーを押してコンソールを確認します。。

`Hello World!` と出ていて、index.ts に書かれたコードが実行されたことがわかります。

また、`serve` のコマンドでビルドも行われ、さらにファイルが変更されたら自動的に差分ビルドを実施します。

`index.ts`を変更してみましょう。

```ts
console.log("Hello WebPack & Typescript!");
```

待ちの状態だったコンソールが更新されました。ビルドが実行されたということです。  
さらに、ブラウザも勝手にリロードしました。コンソールに、変更したメッセージが表示されていると思います。

このように、WebPack を使うと変換する手間が増えるように思われますが、このような仕組みを使うことで、開発効率が上がります。

## バンドルを試してみる

### プロジェクト内で分割したファイルを参照する

先程は、1つのファイルで変換したので、今度は複数のファイルをバンドルしてみましょう。

`hello.ts` を追加します。

ここに、下記コードを書きます。

```ts
export const hello = (name: string) => {
    return `こんにちは、${name} さん`;
};
```

`export` とすることでその変数や関数を、import で参照したファイルの方で、使うことが出来ます。

これをコンソールに出力するのはつまらないので、DOMを操作して画面にメッセージを表示してみましょう。

まず `index.html` に 出力先となる `id='app'` を持つタグを追加します。  
`dist` の下にある `index.html` 

```html
    <body>
        <h1>Hello world!</h1>
        <h2>Tip: Check your console</h2>
        <div id="app"></div>
    </body>
```


`index.ts` を編集します。名前のところは適当に変えてください。

```ts
import { hello } from "./hello";

console.log("Hello Webpack & TypeScript!");

document.getElementById("app"). = hello("えびはら");
```

`yarn serve` を実行したままであれば保存するとビルドが実行されるはずです。

画面には、`hello.ts`の関数で生成された文字列が表示されています。複数に分けたファイルがマージされていることがわかります。

### yarn add でインストールしたパッケージを参照する

`yarn add` でインストールしたパッケージを参照してみます。

以前のセクションでも少し触れましたが、dayjs を使ってみましょう。

新しいフォルダで始めた場合は、インストールしてください。

```
yarn add dayjs
```

`hello.ts`　でパッケージを参照してみましょう。

```ts
import dayjs from "dayjs";

export const hello = (name: string) => {
  const date = dayjs().format("YYYY-MM-DD HH:mm");
  return `こんにちは、${name} さん ${date}`;
};
```

保存して実行すると、名前の後に日時が表示されると思います。

パッケージは、`node_modules` に入りますが、ここにあるものはパスを指定する必要はありません。基本的に名前にはパッケージ名を入れますが、ライブラリによっては異なる場合があるので、それごとの Readme を確認してください。

`index.ts` で書いたように、`node_modules`にないファイルについては、同じフォルダであっても、`./` のパスから書くようにします。

## まとめ

Webpack では、例えば React などのフレームワークの部分と、独自に実装した部分を分けてバンドルするなど出来ます。そうすることで、プログラムを変更したときでも、フレームワークの部分は変わらないので、ユーザーはブラウザのキャッシュが使え、レスポンスの向上が期待できます。

このように、Webpackには多くの機能があります。ここでは基本的な機能のみを説明しましたが、Web上には多くの記事があるので、各自で調べてみてください。

コードのメンテナンス性を保つには、プログラムをモジュール=ファイルの単位に適切に区切って、管理することが必要です。

ツールの使い方だけでなく、そのあたりの設計も重要になります。
