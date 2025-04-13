import { Request, Response } from 'express';
import apiService from 'service/apiService';
import respond from 'view/respond';
import jwtHelper from 'src/helper/jwtHelper';

export default {
    changePasswordController: async (req: Request, res: Response) => {
        //@ts-ignore
        const { email, fingerprint} = req.user

        const newPassword = req.body.newPassword

        const passwordRegex = /^[A-Za-z0-9]{10,25}$/;

        if (!passwordRegex.test(newPassword)) {
            res.status(400).json(respond(400, {
                error: "Password must be between 10 and 25 characters long, containing only letters and numbers, with no special characters."
            }));
        }

        try {
            const newPasswordHash = await apiService.changePasswordService(email, newPassword)
            const newJwt = jwtHelper.jwtSign(email, fingerprint, newPasswordHash)

            res.send(respond(200, {
                message: "change password success",
                jwt: newJwt
            }))
        } catch(e:any) {
            res.status(400).json(respond(400, e.message))
        }
    },

    changeInfoController: async (req: Request, res: Response) => {
        //@ts-ignore
        const {email} = req.user
        const {displayName, aboutMe, phone, dob, gender} = req.body;

        if (!displayName || !aboutMe || !phone || !dob || !gender) {
            res.status(400).json(respond(400,{ error: 'All fields are required' }));
        }

        
        const data = await apiService.changeInfoService(email, displayName, aboutMe, phone, dob, gender)
        res.send(respond(200, {message: "success"}))
    }
}