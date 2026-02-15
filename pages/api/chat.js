// Importing necessary libraries
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const router = express.Router();

// Initialize OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Chat API endpoint
router.post('/chat', async (req, res) => {
    const userInput = req.body.message;
    
    // Call OpenAI API
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userInput }],
        });
        const botResponse = completion.data.choices[0].message.content;
        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        res.status(500).send('Error processing request');
    }
});

module.exports = router;