// service/chatService.ts
import ChatModel from 'model/chatModel';
import vhisPlans from 'data/insurance.json';
import geminiService from './geminiService';
import boxChatService from './boxChatService';
import TagLog from 'model/tagLog';
import { name } from 'ejs';

const buildConversationPrompt = (history: { content: string }[]): string => {
    return history.map(h => `User: ${h.content}`).join('\n') + '\nAI:';
};

export default {
    handleUserMessage: async (message: string, email: string): Promise<any> => {
        try {
            await ChatModel.create({ email, content: message });

            const { tags, top } = await boxChatService.getTopInsuranceTags(message);

            console.log("tagNames", tags);

            const history = await ChatModel.find({ email })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('content -_id')
                .lean();

            const prompt = buildConversationPrompt(history);

            let geminiReply: string;

            try {
                const reply = await geminiService.callGemini(prompt, tags);
                geminiReply = typeof reply === 'string'
                    ? reply
                    : JSON.stringify(reply); // fallback nếu là object
                const formattedReply = geminiReply.replace(/\n/g, '<br/>');
                geminiReply = formattedReply;
            } catch (err) {
                console.error('Gemini failed:', err);
                geminiReply = 'Sorry, I could not generate a reply at the moment.';
            }

            await ChatModel.create({ email, content: geminiReply });

            const data = await boxChatService.getIdProduct(message)
            let matchedPlans: any[] = [];

            if (tags.length > 0) {
                const crmTags = tags.map(tag => {
                    const match = vhisPlans.find(p => p.name === tag);
                    return match ? match.name : null;
                }).filter(Boolean); // lọc ra các tag hợp l
                
                const exitsTagLog = await TagLog.findOne({ email })
                
                console.log("cmTags", crmTags);
                if (!exitsTagLog) {
                    const data:any[] = []
                    crmTags.forEach((tag, index) => {
                        data.push({ number: 1, tagName: tag })
                    })
                    await TagLog.create({
                        email,
                        tags: data,
                        topTag: top?.['tag name'] // chọn cuối làm đại diện
                    });
                    matchedPlans = vhisPlans.filter(p => p.name === top?.['tag name']
                    );
                }else {
                    let max = 0;
                    let topTag = exitsTagLog.topTag;
                                        // First, handle existing tags by incrementing their number
                    crmTags.forEach(tag => {
                        console.log("max", max);
                        console.log("topTag", topTag);
                        const existingTag = exitsTagLog.tags.find(t => t.tagName === tag);
                        if (existingTag) {
                            // Increment number for existing tag
                            existingTag.number = existingTag.number?existingTag.number+1:1;
                            if (existingTag.number > max) {
                                max = existingTag.number;
                                topTag = existingTag.tagName;
                            }
                            
                        } else {
                            // Add new tag with number 1
                            exitsTagLog.tags.push({ number: 1, tagName: tag });
                            if (!topTag) {
                                topTag = tag;
                            }
                        }
                        exitsTagLog.topTag = topTag;
                    });
                    
                    // Update the top tag
                    console.log("exitsTagLog", exitsTagLog);
                    await exitsTagLog.save();
                    matchedPlans = vhisPlans.filter(p => p.name === topTag
                    );
                }

                

                console.log("matchedPlans", matchedPlans);
            }
        

            return {
            botReply: geminiReply,
            recommendedPlans: data,
            matchedPlans: [{
                name: matchedPlans[0]?.name,
                type: matchedPlans[0]?.type,
                targetAudience: matchedPlans[0]?.targetAudience,
                features: matchedPlans[0]?.features,
            }
            ],
        };
    } catch(err) {
        console.error(err);
        throw new Error('Lỗi khi xử lý tin nhắn và phản hồi bot');
    }
},

getRecentMessages: async (email: string, limit = 10) => {
    return await ChatModel.find({ email })
        .sort({ createdAt: 1 })
        .limit(limit)
        .select('content -_id')
        .lean();
}
};
