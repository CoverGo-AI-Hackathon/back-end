import { Request, Response }  from 'express';
import store from 'config/store';
import userService from 'service/userService';
import infoService from 'service/infoService';

export default {
    getInfoController: async (req: Request, res: Response) => {
        // @ts-ignore
        const { email } = req.user

        const user = await infoService.getInfoService(email)

        res.send(user)
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