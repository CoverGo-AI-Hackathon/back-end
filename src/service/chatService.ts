// service/chatService.ts
import ChatModel from 'model/chatModel';
import axios from 'axios';
import vhisPlans from 'data/insurance.json';
import respondHelper from 'view/respond';


const mockBotReply = (message: string): string => {
    // Có thể dùng tạm rule hoặc template, hoặc đơn giản là:
    return `Tôi đã ghi nhận câu hỏi: "${message}". Cảm ơn bạn!`;
};

const getReasonFromTarget = (plan: any): string => {
    const audience = plan.targetAudience.join(', ');
    return `Phù hợp cho ${audience}`;
};

const structuredData = {
    age: 40,
    budget: "< 500 HKD/tháng",
    concern: "gia đình có con nhỏ",
    needs: ["nhập viện", "phẫu thuật"]
};

export default {

    sendUserMessage: async (message: string, email: string): Promise<string> => {

        const reply = mockBotReply(message);

        await ChatModel.create({ email, content: message });

        return reply;
    },

    getRecentMessages: async (email: string, limit = 10) => {
        return await ChatModel.find({ email })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('content -_id')
            .lean();
    },

    getBotReply: async (message: string): Promise<any> => {
        try {
            // Tạm structuredData mock – sau này có thể phân tích từ message
            const structuredData = {
                age: 40,
                budget: '< 500 HKD/tháng',
                concern: 'gia đình có con nhỏ',
                needs: ['nhập viện', 'phẫu thuật']
            };

            const matchedPlans = vhisPlans
                .filter(plan => plan.targetAudience.some(a => a.includes('gia đình')))
                .slice(0, 3)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    type: p.type,
                    targetAudience: p.targetAudience,
                    monthlyPremiumHKD: p.monthlyPremiumHKD,
                    features: p.features,
                    limitations: p.limitations,
                    coverage: p.coverage
                }));

            return {
                recommendedPlans: matchedPlans,
                structuredData
            };
        } catch (err) {
            console.error(err);
            throw new Error('Lỗi khi tạo phản hồi cho chatbot');
        }
    }
};
