/*
- コンストラクタ
    - ジェネリック型でバッファの型を指定できる。
    - 引数に、バッファのサイズを数値で指定できる。(2以上の整数)
        - 2未満の場合は、例外を発生させる。メッセージは、"引数のバッファサイズは 2以上 を指定して下さい。"
    - 現在のインデックスを '-1'(バッファがないため) とする。
- push メソッド
    - リングバッファに引数の値をバッファの現在のインデックスの次に格納する。
        - 現在のインデックスが '-1'（初期状態）の場合は、'0' に格納する。
    - バッファの現在の現在のインデックスを +1 する。
        - 最大バッファ数を超える場合は、現在のインデックスを 0 とする。
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
*/

/**
 * リングバッファ
 */
export class RingBuffer<T> {
  /** バッファ */
  private buffer: T[];
  /** 現在のインデックス */
  private _currentIndex: number;
  /**
   *
   * @param size - バッファサイズ;
   */
  constructor(size: number) {
    if (size < 2) {
      throw new Error('引数のバッファサイズは 2以上 を指定して下さい。');
    }
    this.buffer = new Array<T>(size);
    this._currentIndex = -1;
  }
  /** 配列として返す */
  public toArray(): T[] {
    return [];
  }
  /**
   * バッファに値を追加する
   * @param item - 追加する値
   */
  public push(item: T): void {
    if (++this._currentIndex > this.buffer.length - 1) {
      this._currentIndex = 0;
    }
    this.buffer[this._currentIndex] = item;
  }
  /**
   * 現在の先頭の値を返して削除する
   */
  public pop(): T {
    const res = this.buffer[this._currentIndex--];
    if (this._currentIndex < 0) {
      this._currentIndex = this.buffer.length - 1;
    }
    return res;
  }
  /**
   * 現在の先頭の値を返す
   */
  getCurrent(): T {
    return {} as T;
  }
  /** 現在の値 */
  get currentIndex(): number {
    return -1; // 型違反をなくすため
  }
}
