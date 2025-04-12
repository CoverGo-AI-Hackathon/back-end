// controller/chatController.ts
import { Request, Response } from 'express';
import chatService from 'service/chatService';
import respondHelper from 'view/respond';
import geminiService from 'service/geminiService';

export default {
    sendMessage: async (req: Request, res: Response) => {
        try {
            const { message } = req.body;
            // @ts-ignore
            const { email } = req.user
            const reply = await chatService.handleUserMessage(message, email);
            res.json(respondHelper(200, { reply }));
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Internal server error';
            res.status(500).send(respondHelper(500, errorMessage));
        }
    },

    getRecentMessages: async (req: Request, res: Response) => {
        try {
            const email = (req as any).user?.email || 'guest';
            const limit = parseInt(req.query.limit as string) || 10;
            const messages = await chatService.getRecentMessages(email, limit);
            res.json(respondHelper(200, messages));
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Internal server error';
            res.status(500).send(respondHelper(500, errorMessage));
        }
    }
}

