import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import store from 'config/store';
import { v4 as uuidv4 } from 'uuid';

export default {
    jwtSign: (email: string, fingerprint:string, passwd:string) => {
        const secret = process.env.JWT_SECRET;

        return jwt.sign({
            uuid: uuidv4(),
            email: email,
            fingerprint: fingerprint || 'null',
            passwd: passwd || 'null'
        }, secret!, { expiresIn: '1h' });
    },

    jwtVerify: (token: string) => {
        const secret = process.env.JWT_SECRET;
        return jwt.verify(token, secret!) as JwtPayload;
    },

    getPayloadFromToken: (token: string): JwtPayload => {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    }
}