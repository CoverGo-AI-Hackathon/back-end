import { Request, Response }  from 'express';
import store from 'config/store';
import userService from 'service/userService';
import infoService from 'service/infoService';
import redisService from 'service/redisService';
import respond from 'view/respond';

export default {
    getInfoController: async (req: Request, res: Response) => {
        // @ts-ignore
        const { email } = req.user

        const cache = await redisService.getItem(`${email}_INFO`)

        if(cache) {
            res.send(JSON.parse(cache))

            return
        }

        const user = await infoService.getInfoService(email)

        redisService.setItem(`${email}_INFO`, JSON.stringify(user[0]), 3600)
        res.send(user[0])
    },

    patchInfoController: async (req: Request, res: Response) => {
        const changeableAtr = [
            "aboutMe",
            "phone",
            "dob"
        ]

        res.send(req.body)
    }
}