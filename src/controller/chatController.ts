// controller/chatController.ts
import { Request, Response } from 'express';
import chatService from 'service/chatService';
import respondHelper from 'view/respond';
import geminiService from 'service/geminiService';
import redisService from 'service/redisService';

export default {
    sendMessage: async (req: Request, res: Response) => {
        try {
            const { message } = req.body;
            // @ts-ignore
            const { email } = req.user
            const reply = await chatService.handleUserMessage(message, email);

            redisService.deleteItem(`${email}_RECENT_MSG`)
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
            const cache = await redisService.getItem(`${email}_RECENT_MSG`)

            if(cache) {
                res.json(respondHelper(200, JSON.parse(cache)))

                return
            }

            const limit = parseInt(req.query.limit as string) || 10;
            const messages = await chatService.getRecentMessages(email, limit);

            redisService.setItem(`${email}_RECENT_MSG`, JSON.stringify(messages), 3600)
            res.json(respondHelper(200, messages));
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Internal server error';
            res.status(500).send(respondHelper(500, errorMessage));
        }
    }
}

