import express, { Router }  from 'express';
import authController from 'src/controller/authController';
import apiMiddleware from 'middleware/apiMiddleware';
import infoController from 'src/controller/infoController';

const router: Router = express.Router();

router.use(apiMiddleware.verifyToken)

router.get('/logOut', authController.logOutController)
router.get('/info', infoController.getInfoController)
router.patch('/info', infoController.patchInfoController)

export { router };
