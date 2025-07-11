import { Encrypter } from "src/domain/application/cryptography/encrypter.contract";

export class FakeEncrypter implements Encrypter {
  public item: any = '';

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    const token = JSON.stringify(payload);
    this.item = token;
    return token;
  }

  async verify(token: string): Promise<boolean> {
    return JSON.stringify(token) === JSON.stringify(this.item)
      ? JSON.parse(this.item)
      : false;
  }
}
