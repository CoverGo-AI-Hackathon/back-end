import { Request, Response } from 'express';
import store from 'config/store';
import userService from 'service/userService';
import redisService from 'service/redisService';
import jwtHelper from 'src/helper/jwtHelper';
import respond from 'view/respond';
import respondHelper from 'view/respond';
import authService from 'service/authService';
import hcmacHelper from 'src/helper/hcmacHelper';


export default {
    loginController: (req: Request, res: Response) => {
        res.redirect(store.googleLoginUrl);
    },

    googleCallbackController: async (req: Request, res: Response) => {
        const code: string = req.query.code as string;

        const fingerprintHeader = req.headers['x-fingerprint'];
        const fingerprint = Array.isArray(fingerprintHeader)
            ? fingerprintHeader[0]
            : fingerprintHeader || 'unknown';

        const access_token = await userService.handleGoogleOAuth(code, fingerprint)

        res.redirect(`${process.env.FRONT_END_REDIRECT_URL}?access_token=${access_token}` || `https://example.com?access_token=${access_token}`)
    },

    loginWithEmail: async (req:Request, res:Response) => {
        let {email, password, fingerprint} = req.body

        password = hcmacHelper.hash(password)

        const verify:boolean = await authService.loginWithEmail(email, password)

        if (verify) {
            let {email, password, fingerprint} = req.body
            res.send(respond(200, jwtHelper.jwtSign(email, fingerprint, password)))
        } else {
            res.status(401).json(respond(400, "fail to login"))
        }
    },

    logOutController: async (req: Request, res: Response) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

        const payLoad = jwtHelper.getPayloadFromToken(token!)

        const ttl = (payLoad!.exp || 0) - Math.floor(Date.now() / 1000)

        redisService.setItem(`BLACK_LIST_TOKEN:${payLoad.uuid}`, "check", ttl)

        res.json(respond(200, "Đăng xuất thành công"))
    }
}