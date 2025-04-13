import express, { Router }  from 'express';
import authController from 'src/controller/authController';
import apiMiddleware from 'middleware/apiMiddleware';
import infoController from 'src/controller/infoController';
import chatController from 'src/controller/chatController';
import apiController from 'src/controller/apiController';

const router: Router = express.Router();

router.use(apiMiddleware.verifyToken)

router.get('/logOut', authController.logOutController)

router.get('/info', infoController.getInfoController)
router.patch('/info', apiController.changeInfoController)

router.post('/chat', chatController.sendMessage)
router.get('/recent', chatController.getRecentMessages)
router.patch('/changePassword', apiController.changePasswordController) 

export { router };
