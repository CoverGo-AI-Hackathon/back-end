import dotenv from 'dotenv'
import { createHmac } from 'crypto';
dotenv.config()

export default {
    hash: (content:string) => {
        const secret:string = process.env.HMAC_SECRET_KEY!

        const hash = createHmac('sha256', secret)
              .update(content)
              .digest('hex');

        return hash
    }
}