# JavaScript でよく使用されるライブラリ

筆者: 海老原 賢次（kenji.ebihara@jrits.ricoh.co.jp）  
作成日: 2021-08-18  
更新履歴:

- 2021-08-18: 新規作成

---

## 概要

Webアプリに関係なく、JavaScript では特に理由がない限り、多くの大小のOSSのフレームワークやライブラリを利用します。

これらを利用するかどうかで、作業効率やメンテナンス性が大きく異なります。

## Redux

Redux は Flux の概念をとりいれた、データフローフレームワークです。レンダリングの機能は有りません。Flux については[アーキテクチャの章](../01.architecture/index.md#flux)でお話しました。

Redux では、下記のような要素に分かれて実装します。

- View

  Storeの値を参照し、DOMレンダリングする。画面の操作は、Action Creator で Action を作成し、Reducer に Dispatch で送る。

- Action

    ユーザー操作イベントやAPIレスポンスの受け取りなど、「何をする」と変更処理のためのデータを持ったオブジェクト。
    dispatch関数を使って Action を reducer に送る。

- Action creator
  
    Actionを生成する関数。

- Reducer

    送られてきたActionと、元のstateをもとに、新しいstateを返す純粋関数。

- Store

    アプリケーションのstateを保持する。
    Actionがdispatch(送信)されるとReducerの呼び出しによってstateが更新される。

[Flux, Redux, SAMのデータフローをざっくり理解する - Qiita](https://qiita.com/aimy-07/items/e252ff3be2f4e7fdc9f5)

[Redux入門【ダイジェスト版】10分で理解するReduxの基礎 - Qiita](https://qiita.com/kitagawamac/items/49a1f03445b19cf407b7)

View の部分に React を採用することが多いですが、Redux はそれ単体でも導入できるので、Vue.js や jQuery と合わせて利用することもできますし、サーバーサイドでも利用できます。

ただ、Redux は学習コストがやや高いと言われています。今までにないフレームワークでその理念や概念を理解しにくいためだと思います。

React にも、Context と Reducer の機能が追加されており、Redux を導入しなくても Flux を導入できます。が、概念は一緒ですので、同様の学習は必要です。
また、大規模なアプリでは、Redux のほうがより管理しやすとも思います。

[Redux - A predictable state container for JavaScript apps. | Redux](https://redux.js.org/)

## React Router

React 用の SPA を実現するためのフレームワークです。

通常画面の切り替えるときには、サーバーに問い合わせに行き、画面全体をHTMLからロードする必要があります。

SPA とは、シングル・ページ・アプリケーション の略で、画面遷移時に実際には遷移せずに JavaScript で画面を書き換えることで、あたかも画面遷移したように見せる事ができるものです。

メリットとして、HTMLやJavaScriptファイルを読み込み直さない分、画面遷移が高速で、JavaScript 変数等も保持したままなので、より高度なUIが実現できます。

SPAを実現するには、難しい処理が必要ですが、このフレームワークを導入することで、簡単にSPA が実装できます。

Vue.js には、この機能が備わっているので、別途導入する必要はありません。

[React Router: Declarative Routing for React.js](https://reactrouter.com/)

## Material UI

React の UI フレームワークで、ボタンなどのフォームやグリッドレイアウトなどの部品州となっています。

各部品は、Googleが提唱している、Material Design に則った装飾が施されています。これを導入するだけで、イマドキのUIを実現できます。

日付ピッカーなどもあり、非常に便利です。が、ちょっとコードのサイズが大きいです。

[Material-UI: A popular React UI framework](https://material-ui.com/)

## styled-components / emotion

CSS in JS のフレームワークです。

CSS in JS とは、通常 CSS は HTML や JavaScript とは別のファイルで管理されるのですが、それを JavaScript の中に取り込んでしまう、というものです。

React でコンポーネントとして部品化しますが、これを利用してスタイルもコンポーネントとして管理することで、表示、処理、装飾がコンポーネントにパッキングされ、管理が非常にしやすくなります。

emotion では、下記のように書けます。

```tsx
/** @jsx jsx */
import { css, jsx } from "@emotion/react";

const root = css`
  background-color: red;
`;

export const Sample: React.FC = () => {
  return (
    <div className={root.name}>
      <p>sample</p>
    </div>
  );
};
```

styled-component が多く使われてきましたが、後発の emotion がかゆいところに手が届く感じで、今後のスタンダードになりそうです。

[styled-components](https://styled-components.com/)

[Emotion - Introduction](https://emotion.sh/docs/introduction)

## superagent / axios

HTTPクライアントのライブラリです。

ブラウザからのHTTP通信では、従来はブラウザで提供されている XMLHttpRequest API を利用していました。これを利用するのは非常に煩雑で面倒でした。現在ではJavaScriptの仕様（正確には ECMAScript）で fetch という APIが提供されおり、これを実装したブラウザが多いです。（IE以外のモダンブラウザは対応している）。

fetch で大分コーディングが楽になりましたが、それでも面倒なところがありますし、IEに対応する場合は fetch は使えません。

そこで、superagent や axios といったライブラリを利用することで、ブラウザ間の差異を吸収し、且つ少ないコードで書くことができます。Promise に対応しているところも大きい利点です。

また、それぞれ Node.js にも対応しているので、サーバーサイドに Node.js を採用している場合、それぞれ同じ記述で書くことができます。

それぞれの比較ですが、どちらも大差ない印象です。Github を見ると、axios のほうが星が多いですが、superagent の方がコードの品質が高いようにも思えます。
後は療法を試してみて、書き方がしっくり来る方を選べばよいかと思います。

[Getting Started | Axios Docs](https://axios-http.com/docs/intro)

[SuperAgent — elegant API for AJAX in Node and browsers](https://visionmedia.github.io/superagent/)

## Moment.js / Day.js

Moment.js / Day.js は、日付のデータを扱うライブラリです。JavaScript 標準の Date を拡張するものです。

日付のフォーマット、追加削除などの計算、タイムゾーンによる変換などができます。

それぞれの比較ですが、ほぼ同じ機能を持っていますが、Moment.js は開発が停止していますので、Day.js を利用するようにしましょう。

Day.js は後発で、Moment.js に比べサイズも非常に小さくなっています。

[Day.js · 2kB JavaScript date utility library](https://day.js.org/)

## ESLint / Prettier

これは、開発環境で利用するユーティリティです。

ESlint は、いわゆる Linter です。Linter は 静的解析ツールであり、コードの問題点を指摘するものです。メンテナンス性のの悪化や危険性の有る記述を警告してくれます。

例えば、var の代わりに let, const が推奨されていますし、そもそも変数宣言がないものも動作はしますが管理が非常にしにくいため、推奨されません。

そうったものを ESLint で検知できます。そういったルールは 100 以上あり、On/Offを細かく設定できますし、それが面倒な場合は、Recommend されたセットが利用できます。

Prettier は、コードフォーマッタで、コードのインデントや カッコなどの前後のスペース、１行の最大文字数などのルールが設定でき、自動フォーマットの機能もあります。

ESLint にもそれらのチェックは有るのですが、自動修正の機能はないので、Prettier を利用することが多いです。

このような Linter は、JavaScript だけでなく、他の言語でも用意されており、これを使うことがスタンダードになっています。

[ESLint - Pluggable JavaScript linter](https://eslint.org/)

[Prettier · Opinionated Code Formatter](https://prettier.io/)

## jest

Jest は JavaScript のテストフレームワークで、デファクト・スタンダードとなっているものです。

特に、アジャイル開発で反復開発するには品質を担保するために CI/CD で自動テストが実行されることが絶対に必要です。

テストプログラムに必要なモックの作成が簡単にできるのが特徴です。

ただ、これに限らずフレームワークを導入したからテスト未経験者でも書ける、というものではないです。

テストに関しては、別途章を設けて解説したいと思います。

[Jest · 🃏 Delightful JavaScript Testing](https://jestjs.io/ja/)

## webpack

WebPack は、モジュールバンドラと言われるツールです。

一般的な言語におけるソースコードの管理では、モジュール単位で複数のファイルを作成して、必要に応じて他のファイル参照を行います。

ファイルでは、ほかから参照されたときに公開するメソッドや変数、クラスなどを定義します。

Webアプリケーションでは、プログラムファイルをダウンロードして動作することから、ファイルが多数分割しているとパフォーマンス上問題になります。

そこで、分割されているファイルを結合したものをデプロイすることが多いです。

webpack はその結合処理を行います。

また、コードのサイズを低減するために、改行やインデントを削除するなどする処理（ミニファイ）を行うこともできますし、ES20xx に対応していない古いブラウザでも動作するように、トランスパイルすることもできます。

さらに、プラグインを利用することで、TypeScript や sass を変換したり、HTML に出力した JavaScript ファイルのリンクを追加したりするなど、ビルドヘルパーの機能を持たせることもできます。

## まとめ

ここに紹介したもの以外にも、様々なパッケージがあります。

自作する前に、パッケージが無いかな？と考え、探してみましょう。

もちろん、それを採用するかどうかは判断が必要です。特に、利用者数の少ない、更新が何年もされていない、などのものは避けるべきです。

それらを踏まえて使えるものは積極的に使っていきましょう。
