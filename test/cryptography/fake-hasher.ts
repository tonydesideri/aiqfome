import { Hasher } from "src/domain/application/cryptography/hasher.contract";

export class FakeHasher implements Hasher {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
