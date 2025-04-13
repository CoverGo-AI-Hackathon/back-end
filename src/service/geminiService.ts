import axios from 'axios';
import dotenv from 'dotenv';
import vhisPlans from 'data/insurance.json';

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-key-here';

const buildPrompt = (userInput: string, tags: string[]) => `
You are a helpful insurance advisor.

The customer said: "${userInput}"

A semantic model suggests these plans may fit the customer:
${tags.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Please respond **directly to the customer**.

For each plan, **explain in 1–2 natural sentences** why it might suit them. Use the plan's full name when referencing it.

Do not explain generic terms like "Full coverage" or "High cost" unless it's part of the plan's name.

Avoid bullet points or JSON, HTML. Write as if you're chatting directly with the customer in a kind and clear way.
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
