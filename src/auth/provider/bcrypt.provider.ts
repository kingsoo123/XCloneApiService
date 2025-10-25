import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptProvider extends HashingProvider {
    public async hashPassword(password: string | Buffer): Promise<string> {
        let salt = await bcrypt.genSalt()

        return bcrypt.hash(password, salt)
    }

    public async comparePassword(plainPassword: string | Buffer, hashPassword: string | Buffer): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashPassword)
    }
}
