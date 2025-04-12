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

    handleUserMessage: async (message: string, email: string): Promise<any> => {
        try {
            // 1. Lưu tin nhắn người dùng
            await ChatModel.create({ email, content: message });

            // 2. Phân tích structuredData (tạm mock)
            const structuredData = {
                age: 40,
                budget: '< 500 HKD/tháng',
                concern: 'gia đình có con nhỏ',
                needs: ['nhập viện', 'phẫu thuật']
            };

            // 3. Chọn gói bảo hiểm phù hợp
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

            // 4. Trả lại kết quả
            return {
                recommendedPlans: matchedPlans,
                structuredData
            };
        } catch (err) {
            console.error(err);
            throw new Error('Lỗi khi xử lý tin nhắn và phản hồi bot');
        }
    },

    getRecentMessages: async (email: string, limit = 10) => {
        return await ChatModel.find({ email })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('content -_id')
            .lean();
    },

};
