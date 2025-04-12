import express, { Router }  from 'express';
import chatController from 'src/controller/chatController';

const router: Router = express.Router();
// Define the routes
router.post('/gemini', chatController.askGemini);



export { router };
