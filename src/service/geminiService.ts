import axios from 'axios';
import dotenv from 'dotenv';
import vhisPlans from 'data/insurance.json';

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-key-here';

const buildPrompt = (userInput: string, tags: string[]) => `
User input: "${userInput}"

The following insurance plans were recommended by a similarity model:
${tags.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Please explain briefly (1–2 sentences each) why each plan may suit the user.
Avoid markdown, no JSON, just helpful, human-friendly explanation.
`.trim();



export default {
    callGemini: async (userInput: string, tags: string[]): Promise<string> => {
        const prompt = buildPrompt(userInput, tags);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    contents: [{ parts: [{ text: prompt }] }]
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply';
            return resultText;

        } catch (error: any) {
            console.error('Gemini API error:', error.message);
            return 'Sorry, I couldn’t generate an explanation right now.';
        }
    }

};
