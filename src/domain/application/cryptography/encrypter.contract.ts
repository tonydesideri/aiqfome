// TODO: Criar dois metodos para gerar os tokens
export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    expiresIn: string,
  ): Promise<string>;

  abstract verify(token: string): Promise<any>;
}
