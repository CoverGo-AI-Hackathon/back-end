import express, { Router }  from 'express';
import authController from 'src/controller/authController';
import api from 'middleware/api';

const router: Router = express.Router();

router.use(api.verifyToken)
router.get('/logOut', authController.logOutController)

export { router };
