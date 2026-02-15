// pages/api/wechat.js

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        // Integrate your AI model here to generate a response
        const aiResponse = await getAIResponse(message);

        // Respond back to WeChat Work
data = {
            msgtype: 'text',
            text: {
                content: aiResponse,
            },
        };

        try {
            await axios.post('https://your-wechat-webhook-url', data);
            res.status(200).json({ status: 'success' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to send message' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getAIResponse(message) {
    // Placeholder for AI response logic
    return `AI response to: ${message}`;
}