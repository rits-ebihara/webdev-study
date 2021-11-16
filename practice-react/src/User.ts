/* eslint-disable require-jsdoc */
export class User {
  constructor(name: string) {
    this.name = name;
  }
  public name: string;
  public callUser() {
    return `${this.name} さん、こんにちは`;
  }
}
