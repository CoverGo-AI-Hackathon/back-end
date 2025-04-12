import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-key-here';


export default {
    callGemini: async (prompt: string): Promise<string> => {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [{ text: prompt + ' Minumum 50 words since I have to transfer to my customers ' }],
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Check if the response contains the expected structure
            if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
                throw new Error('Unexpected response structure from Gemini API');
            }
            // Extract the text from the response
            // @ts-ignore
            console.log('Gemini API response:', response.data);

            const result = response.data;
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

            return text;
        } catch (error : any) {
            console.error('Gemini API error:', error.message);
            return 'Something went wrong with Gemini.';
        }
    }
};
