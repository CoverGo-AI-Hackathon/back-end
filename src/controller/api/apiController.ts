import { Request, Response }  from 'express';
import store from 'config/store';
import userService from 'service/userService';

export default {
    logOutController: async (req: Request, res: Response) => {
        res.send("fuck you")
    }
}