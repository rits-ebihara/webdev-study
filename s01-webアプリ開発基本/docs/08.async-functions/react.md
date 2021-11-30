# 非同期処理の React での実践

## 目的

ここでは、React アプリの作成を通して、JavaScript での非同期処理の扱いを学習します。

## アプリの目的

気象庁が天気予報の情報を API で提供しています。

> 正式には、公開されているAPIではありません。気象庁がホームページで利用している API を拝借しているだけです。  
> なので、公式のドキュメントもないですし、気象庁の都合で変更される可能性があります。  
> 利用に関しては、政府標準利用規約に準拠する必要があります。  
> - [気象庁公式の天気予報API（？）が発見 ～Twitterの開発者界隈に喜びの声が満ちる - やじうまの杜 - 窓の杜](https://forest.watch.impress.co.jp/docs/serial/yajiuma/1309318.html)  
> - [気象庁の中の人によるツイート](https://twitter.com/e_toyoda/status/1364504338572410885?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1364504338572410885%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fforest.watch.impress.co.jp%2Fdocs%2Fserial%2Fyajiuma%2F1309318.html)  
> - [気象庁 | 著作権・リンク・個人情報保護について](https://www.jma.go.jp/jma/kishou/info/coment.html)

## 