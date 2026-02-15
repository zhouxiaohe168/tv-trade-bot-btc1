// lib/openai-client.js

const axios = require('axios');

class OpenAIClient {
    constructor(apiKey, systemPrompt) {
        this.apiKey = apiKey;
        this.systemPrompt = systemPrompt;
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

    async sendMessage(message) {
        try {
            const response = await axios.post(this.apiUrl, {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'system', content: this.systemPrompt }, { role: 'user', content: message }],
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message to OpenAI API:', error);
            throw new Error('Failed to communicate with OpenAI API.');
        }
    }
}

module.exports = OpenAIClient;