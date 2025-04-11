import express, { Router }  from 'express';
import { defaultFormat } from 'moment';
import paymentController from 'src/controller/paymentController';


const router: Router = express.Router();

router.post('/callback', paymentController.zaloPayCallBackHandler)
router.get('/createOrder', paymentController.zaloPayCreateOrder)

export {router}