// service/chatService.ts
import ChatModel from 'model/chatModel';
import vhisPlans from 'data/insurance.json';
import geminiService from './geminiService';
import boxChatService from './boxChatService';
import TagLog from 'model/tagLog';
import { name } from 'ejs';

const buildConversationPrompt = (history: { content: string, isBot?: boolean }[]): string => {
    const formatted = history.map(h => `${h.isBot ? 'AI' : 'User'}: ${h.content}`).join('\n');
    const lastUserMessage = history.slice().find(h => !h.isBot)?.content || '';
    return `${formatted}\n\n### User's latest message: "${lastUserMessage}"\nAI:`;
};

function sanitizeGeminiReply(raw: string): string {
    return raw
        .replace(/\\n/g, ' ')               // chuỗi '\n' thành khoảng trắng
        .replace(/\n+/g, ' ')               // xuống dòng thật → khoảng trắng
        .replace(/\*\*(.*?)\*\*/g, '$1')    // bỏ **markdown bold**
        .replace(/\*(.*?)\*/g, '$1')        // bỏ *nhấn mạnh đơn*
        .replace(/\\"/g, '"')               // bỏ escape dấu "
        .replace(/\\+"/g, '"')              // bỏ \ trước dấu "
        .replace(/(^|[\s(])"([^"]+)"([\s.,;!?)]|$)/g, '$1$2$3') // bỏ " quanh từ/cụm
        .replace(/\\+/g, '')                // bỏ dấu \
        .replace(/•/g, '-')                 // dấu gạch đầu dòng đặc biệt
        .replace(/\s{2,}/g, ' ')            // nhiều khoảng trắng → 1
        .trim();
}



export default {
    handleUserMessage: async (message: string, email: string): Promise<any> => {
        try {

            await ChatModel.create({ email, content: message, isBot: false });

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
                const formattedReply = sanitizeGeminiReply(geminiReply);
                geminiReply = formattedReply;
            } catch (err) {
                console.error('Gemini failed:', err);
                geminiReply = 'Sorry, I could not generate a reply at the moment.';
            }

            await ChatModel.create({ email, content: geminiReply, isBot: true });

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
            }]
            
        };
    } catch(err) {
        console.error(err);
        throw new Error('Lỗi khi xử lý tin nhắn và phản hồi bot');
    }
},

getRecentMessages: async (email: string, limit = 10) => {
    const messages = await ChatModel.find({ email })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('content -_id')
        .lean();

    // Trả về các tin nhắn gần đây theo thứ tự từ mới nhất đến cũ nhất
    return messages.reverse().map(msg => ({
        content: msg.content,
        isBot: msg.isBot
    }));
}
};





