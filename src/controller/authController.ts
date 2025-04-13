import { Request, Response } from 'express';
import store from 'config/store';
import userService from 'service/userService';
import redisService from 'service/redisService';
import jwtHelper from 'src/helper/jwtHelper';
import respond from 'view/respond';
import user from 'model/user';
import { message } from 'antd';
import respondHelper from 'view/respond';


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

    logOutController: async (req: Request, res: Response) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

        const payLoad = jwtHelper.getPayloadFromToken(token!)

        const ttl = (payLoad!.exp || 0) - Math.floor(Date.now() / 1000)

        redisService.setItem(`BLACK_LIST_TOKEN:${payLoad.uuid}`, "check", ttl)

        res.json(respond(200, "Đăng xuất thành công"))
    },
    changePassword: async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const { email } = req.user
            const { password } = req.body
            const data = userService.updatePassword(password, email)
            if (!data) {
                res.status(200).json({
                    message: "change password success",
                    refesherToken: data
                })
            }
            res.status(422).json({
                message: "error change password"
            })
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Internal server error';
            res.status(500).send(respondHelper(500, errorMessage));
        }
    }

}