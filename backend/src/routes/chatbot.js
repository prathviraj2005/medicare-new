const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.post('/message', async (req, res) => {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
            text: "Gemini API key is not configured. Please add GEMINI_API_KEY to your backend .env file."
        });
    }

    try {
        const prompt = `You are a helpful and knowledgeable medical assistant for the "MediCare" application. 
        The app allows users to order medicines and request/donate blood.
        Provide helpful, concise, and professional responses. 
        If a user asks about specific medical advice, remind them to consult a professional doctor.
        If they ask about medicines, you can mention common ones like Paracetamol, Ibuprofen, etc.
        User message: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({
            text: "I'm having trouble connecting to my brain right now. Please try again later."
        });
    }
});

module.exports = router;
