import assert from 'assert';
export class RingBuffer<T> {
  public constructor(size: number) {
    assert(
      size >= 3 && size <= 1000,
      '引数は 3 - 1000 の間がサポートされます。',
    );
    this.buffer = Array<T>(size);
  }
  public buffer;
  private currentIndex = -1;
  public push(value: T) {
    this.currentIndex++;
    if (this.buffer.length < this.currentIndex + 1) {
      this.currentIndex = 0;
    }
    this.buffer[this.currentIndex] = value;
  }
  public getCurrent() {
    return this.buffer[this.currentIndex];
  }
  public get(back: number) {
    let index = this.currentIndex - back;
    if (index < 0) {
      index = this.buffer.length - 1;
    }
    return this.buffer[index];
  }
}
