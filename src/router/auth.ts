import express, { Router }  from 'express';
import authController from 'src/controller/authController';

const router: Router = express.Router();

router.get('/login', authController.loginController)
router.post('/loginWithEmail', authController.loginWithEmail)
router.get('/google/callback', authController.googleCallbackController);



export { router };
