import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();



export default {
    getTopInsuranceTags: async (message: string): Promise<{tags: string[], top: {
        'tag name': string;
        percent: string;
    } | null
    }> => {
        try {
            const DOMAIN_AI = process.env.DOMAIN_AI; 
            console.log("DOMAIN_AI", DOMAIN_AI);
            const response = await axios.post(`${DOMAIN_AI}/sendMsg`, { text: message });
            const rawTags:{
                'tag name': string;
                percent: string;
            }[] = response.data?.[0] || []; // lấy mảng tag name
            const top = rawTags.reduce((max, cur) => +cur.percent > +max.percent ? cur : max, {percent: '0', 'tag name': ''});
            const tags = rawTags.map((item: any) => item['tag name']);
            return {tags, top};
        } catch (err: any) {
            console.error("Semantic model error:", err.message);
            return {tags: [], top: null};
        }
    },

    getIdProduct: async (message: string): Promise<any[]> => {
        try {
            const DOMAIN_AI = process.env.DOMAIN_AI; 
            console.log("DOMAIN_AI", DOMAIN_AI);
            const response = await axios.post(`${DOMAIN_AI}/sendMsg`, { text: message });
            const rawTags:any[] = response.data?.[1] || []; 
            return rawTags;
        } catch (err: any) {
            console.error("Semantic model error:", err.message);
            return [];
        }
    }
}
