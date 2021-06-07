import { Decrypter } from '@/data/interfaces/criptography/decrypter'

import jwt from 'jsonwebtoken'

export class JwtAdapter implements Decrypter {
  constructor (private readonly secret: string) {}

  async decrypt (ciphertext: string): Promise<string> {
    return jwt.verify(ciphertext, this.secret) as any
  }
}
