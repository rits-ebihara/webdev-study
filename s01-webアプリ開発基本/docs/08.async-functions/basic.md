# JavaScript での非同期処理

## 概要

非同期処理とは、１つの処理を実行中に、別の処理を並行して実行するものです。

Webアプリケーションでは、サーバー、クライアントどちらも非同期処理が多く出てきます。

サーバーサイドでは、他のサービスやデータベースなどの I/O の処理で、クライアントサでは、バックグラウンドで サーバーと通信するときなど、登場するシーンは多いです。

非同期処理の扱い方を学んでおくのは、必須と言えるでしょう。

また、JavaScript では 他の言語やプラットフォーム異なり、非同期の仕組みが特殊ですので、そのあたりも解説します。

## シングルスレッド と ノンブロッキング I/O

JavaScript は（というようりも、Node.js や ブラウザでのスクリプトエンジンでは、という方が正しいですが便宜上ここではこう表現します）、シングルスレッドで動作します。

シングルスレッドで動作する、ということは、処理が１つしか実行できないということです。

しかし、JavaScript では非同期のメソッド作成できます。これは、ノンブロッキング I/O という仕組みがあるためです。

通常のマルチスレッドを使った非同期処理の場合は、下記のようなイメージです。

料理をするときに、スレッドごとにシェフが居て、それぞれの作業を行う感じですね。恵まれた職場環境です。

![マルチスレッド](multi-thread.drawio.png)

JavaScript の場合、時間がかかる I/O の処理が終わるまで待つ（ブロックする）のではなく、その間に別の処理を行います。

シェフが一人で、作業の待ちの時間を使って他の作業をやる感じです。ワンオペです。ブラックな職場環境かな？

![ノンブロッキングI/O](non-blocking-io.drawio.png)

実際、マルチスレッドのほうが、処理効率は高いです。ただ、スレッドを増やすことは、PCの負荷に影響します。スレッドが作成できる上限もあります。

Webサーバーのようにたくさんのリクエストがある場合、それらはある程度同時に実行しなければなりません。

リクエストごとにスレッドを作るのが理想ですが、多くなりすぎると PCの負荷が高くなりサーバー全体が重くなってしまい、各リクエストの処理がすべて遅くなってしまいます。

ノンブロッキングI/O のWebサーバーではリクエストが増えても、「空き時間に処理する」という仕組みにより、PC自体が重くなりにくく、結果的に多くのリクエストを処理できるようになります。

> 実は マルチスレッドでも、OS や プラットフォーム のレベルで処理を分割して、シーケンシャルに処理されています。  
> ですが、マルチスレッドをプログラムで扱う時には、「同時に処理される」位の速さなので、その認識で良いです。  
> マルチプロセスは、より同時処理の考え方に近いです。（CPUコアレベルで、分割される）  
> マルチプロセスのほうが、PCへの負荷はさらに高いです。

## setTimeout, setInterval

ブラウザ上の JavaScript で、昔からある非同期処理でメジャーなものが、`setTimeout` `setInterval` です。

第1引数の関数を、`setTimeout` であれば、第2引数に指定した時間（ミリ秒）後に、`setInterval` の場合はその間隔で実行する、というものです。

しかし、上で説明したように JavaScript はシングルスレッドで動作します。指定した時間に、他の処理が実行されていた場合どうなるでしょうか？

上の説明を理解されているのであれば答えはわかると思います。「実行中の処理が終わってから実行される」です。

ですので、必ずしも 「第2引数で指定した時間に必ず実行される」、わけではなく、正確には「第2引数で指定した時間後にできるだけ早く実行される」が正解です。

なので、ミリ秒単位のシビアな時間処理が必要な処理には向いていません。(えばゲームとか・・・ですかね。）

## 非同期関数のパターン

非同期関数は、その処理が終わったときに実行する処理を定義できるものがほとんどです。

例えば、画面を開いたときにデータのロードを実行し、それが終わってから、そのデータを使って画面を書き変える、ということが多いです。

### コールバック関数

ES5 以前の Javascript では、非同期関数のコールバック関数で、非同期関数の処理の後の処理を指定することが多かったです。引数としてコールバック関数を渡し、非同期関数の処理が終わってからそれが実行される、という仕組みです。

コールバック関数を使った非同期関数の例として、jQuery というライブラリの `$.get` メソッドを挙げます。これは Webリクエスト発行して、成功したらコールバック関数が実行されるものです。

> ここでは あくまでもコールバック関数の例として上げています。  
> jQuery の .get では、コールバック関数ではなく下で説明する Promise のように、`.done`, `.fail` で、メソッドチェーンで書くこともできます。

```ts
$.get('https://example.com/api/users/001', (user) => {
    // 引数にレスポンスの body が入っている
    document.getElementById('user-name').innerText = user.name;
});
```

非同期関数のあとに更に非同期関数を実行する場合も多いです。例えば、ユーザーの情報を取得して、そのユーザーの組織の情報を取得、さらにその組織の会社情報を取得する、というような場合、下記のようになります。

```ts
$.get('https://example.com/api/users/001', (user) => {
    get('https://example.com/api/orgs/' + user.orgId, (org) => {
        get('https://example.com/api/comps/' + user.compId, (comp) => {
            // 会社を取得したあとの処理
        });
    });
});
```

このように、コールバック関数が入れ子になり大変読みにくくなってしまいます。また、上には書いていませんが、エラーの処理などもコールバック関数として渡すので、そうなるとますます可読性が低下します。

```ts
$.get('https://example.com/api/users/001', (user) => {
    get('https://example.com/api/orgs/' + user.orgId, (org) => {
        get('https://example.com/api/comps/' + user.compId, (comp) => {
            // 会社を取得したあとの処理
        }, (error3) => {
            // comps のエラー処理
        });
    }, (error2) => {
        // orgs のエラー処理
    });
}, (error1) => {
    //  users のエラー処理
});
```

これは ”コールバック地獄”とも呼ばれており、こんなコードは忌避されるものであることは明白でしょう。

### Promise

ES6（ES2015） 以降では `Promise` が導入され、連続する非同期処理の記述が改善しました。

> IE11 では使用できません。同様の機能をもつ OSS のライブラリを導入することで実現できます。  
> [promise - npm](https://www.npmjs.com/package/promise)

`Promise` に対応している非同期関数では、下記のように書けます。

`$.get` のようにHTTPリクエストが送れる `superagent` ライブラリを例としてあげます。

[SuperAgent — elegant API for AJAX in Node and browsers](https://visionmedia.github.io/superagent/)

```ts
agent.get('https://example.com/api/users/001')
    .then(result => {
        const user = result.body;
        return agent.get('https://example.com/api/orgs/' + user.orgId)
    })
    .then(result => {
        const org = result.body;
        return agent.get('https://example.com/api/comps/' + org.compId)
    })
    .then(result => {
        // 会社を取得したあとの処理
    })
    .catch(error => {
        // 上のいずれかでエラーが発生したときの処理
    });
```

このように、`then` を使って非同期の処理を続けて書くことができます。Promise の関数を `return` するのがポイントです。

`catch` は、上のいずれかの処理で例外が発生したときにここに入ってきます。error には、エラーが発生したときのオブジェクトが入ります。

このような書き方をするには、非同期関数が Promise に対応する、正確には、Promise オブジェクトを返す関数である必要があります。

Promise を使った非同期関数を書いてみましょう。ここでは、先の `jQuery` の `$.get` メソッドを　Promise 化してみましょう。

```ts
const promiseGet = (url: string) => {
    return new Promise((resolve, reject) => {
        try {
            $.get(url, (data) => {
                resolve(data);
            })
        } catch(err) {
            reject(err);
        }
    })
};

promiseGet('https://example.com/api/users/001')
    .then(result => {
        // result には、promiseGet の中で `resolve` に渡した値が入る
        const user = result.body;
        return promiseGet('https://example.com/api/orgs/' + user.orgId)
    })
    .then(result => {
        const org = result.body;
        return promiseGet('https://example.com/api/comps/' + org.compId)
    })
    .then(result => {
        // 会社を取得したあとの処理
    })
    .catch(error => {
        // 上のいずれかでエラーが発生したときの処理
    });
```

関数の戻り値として、`new Promise()` で作成したオブジェクトを返します。

引数に関数を指定します。この関数の第１引数は、完了時に呼ぶ関数で、これが呼ばれると、呼び出し元の `.then` が実行されます。`.then` の関数の引数が、`resolve` で渡す値となります。

このように、非同期関数が `Promise` 化されていない場合は `Promise` でラップすることで利便性を上げることができます。

setTimeout を `Promise` 化した sleep 関数も書いてみます。

```ts
const sleep = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

sleep(1000).then(() => {
    // １秒後 実行する処理を書く
});
```

### async / await

`Promise` で非同期処理をコードの見通しがかなり良くなります。`async` / `await` を使うと、あたかも同期処理のような記述で書くことができます。

上の `superagent` を例に書いてみます。

```ts
const fc = async () => {
    const userResult = await agent.get('https://example.com/api/users/');
    const user = userResult.body;
    const orgResult = await agent.get('https://example.com/api/orgs/' + user.orgId);
    const org = orgResult.body;
    const compResult = await agent.get('https://example.com/api/comps/' + org.compId)
    const comp = compResult.body;
    // comp を使った処理

    return comp; // Promise で、`resolve(comp)` したのと同じ
};
```

`async` / `await` は `Promise` とは別のものではなく、書き方が違うだけ、と言えます。

`await` は、非同期関数が終了するのを待ちます。これは `Promise` を返す関数で使用できます。

戻り値は、`Promise` で `resolve` で渡された値です。then の関数の引数になる値ですね。

`await` は、`async` とつけられた関数の中でしか使用できません。

関数に async とつけると、その関数自体が `Promise` を返す非同期関数となります。また、その関数の中で値を return することは、Promise 関数で、`resolve` を実行したのと同じことになります。

下記のように書いたものを同じになります。

```ts
const fc = () => {
    return new Promise((resolve) => {
        agent.get('https://example.com/api/users/001')
            .then(result => {
                const user = result.body;
                return agent.get('https://example.com/api/orgs/' + user.orgId)
            })
            .then(result => {
                const org = result.body;
                return agent.get('https://example.com/api/comps/' + org.compId)
            })
            .then(result => {
                // 会社を取得したあとの処理
                resolve(result);  //  fc 関数の処理の終わり
            });
    });
};
```

## 複数の非同期処理を待ち合わせる: Promise.all

複数の非同期処理を実行し、それらがすべて終了するまで待つ、ということもあります。

その場合は、`Promise.all` を利用することで簡単に実現できます。

```ts
const promises = [];
promises.push(sleep(5000).then(() => "p1"));
promises.push(sleep(1000).then(() => "p2"));
promises.push(sleep(6000).then(() => "p5"));
Promise.all(promises).then((results) => {
  console.log(results);
  // [ 'p1', 'p2', 'p5' ]
});
```

`sleep` は、上で作成した `setTimeout` を `Promise` 化したものです。

非同期関数が返す `Promise` オブジェクトを配列に入れて、`Promise.all` の関数の引数に渡します。

`Promise.all` も `Promise` を返す非同期オブジェクトで、全てが終わると `then` の処理が実行されます。 また、`await` を使用することもできます。（上で述べたように、使用できるのは`async`関数の中だけです）

`then` の引数や `await` での戻り値は、各 `Promise` 関数で `resolve` で返された値の配列です。配列の順番は、`Promise.all` に指定した`Promise`オブジェクトの配列の順番が保持されます。

## ループによる非同期処理

非同期処理で勘違いしやすいのが配列の `forEach` を使ったループ処理での記述です。

配列の値で非同期処理を順番に１つずつ処理したい場合、async / await を使うと、同期処理のような記述ができて便利ですので、下記のように書きがちです。

```ts
const array = [3000, 2000, 1000];
const fn = () => {
  array.forEach(async (item, index) => {
    await sleep(item); // Promise 関数
    console.log(`${index} 完了`);
  });
};

fn();
// 順番に処理されない
// 2 完了
// 1 完了
// 0 完了
```

この実行結果から、配列を順番に処理していない、`await` が無視されているように思うかもしれませんが、そうではなく `async` の関数自体は直ちに処理が終わり、その中の処理で `await` するためです。

下記のように書き変えるとわかりやすいかもしれません。つまり、async メソッドを定義して実行しているだけで、その非同期関数の中で `await` しているだけに過ぎません。

```ts
const fn = () => {
  (async () => {
    await sleep(3000); // Promise 関数
    console.log(`1 完了`);
  })(); // 関数の即時実行
  (async () => {
    await sleep(2000); // Promise 関数
    console.log(`2 完了`);
  })(); // 関数の即時実行
  (async () => {
    await sleep(1000); // Promise 関数
    console.log(`3 完了`);
  })(); // 関数の即時実行
};

fn();
```

各ループの処理を待って、順次に処理したい場合は、`for of` を使います。

```ts
const array = [3000, 2000, 1000];
const fn = async () => {
    // index　がほしいので .entries を使っている
    // 非同期処理とは関係ない
  for (const [index, item] of array.entries()) {
    await sleep(item); // Promise 関数
    console.log(`${index} 完了`);
  }
};

fn();
```

一般的には、せっかく非同期の処理なのに、順次に処理するのはパフォーマンス的にもったいないです。

できる限り、上で説明した `Promise.all` で並列に処理をすべきです。

ただし、使用上順次である必要がある場合や、大量な数で並列に処理をするのには無理がある場合などは、順次処理する必要があるでしょう。

その場合は、上の方法をとって下さい。量が多い場合、10件ずつ 並列処理するなどの処理も良い例です。


## まとめ

JavaScript に限らず、マルチコアな環境が当たり前な現在では、プログラムの実装でも当たり前に書けなければなりません。
（マルチコアは、シングルスレッドな JavaScript には関係ないですが）

非同期処理のコーディングに慣れていないと、テストの時には問題ないのに、沢山の人が使う本番でおかしくなる、というようなことも多いです。

言語の非同期処理の仕様をしっかりとマスターしておきましょう。
