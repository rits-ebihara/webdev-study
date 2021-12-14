export class RingBuffer {
  public constructor(size: number) {
    this.buffer = Array(size);
  }
  public buffer;
  public push(value: any) {
    this.buffer[0] = 'a2';
  }
  public getCurrent() {
    return this.buffer[this.currentIndex];
  }
  private currentIndex = 0;
}
