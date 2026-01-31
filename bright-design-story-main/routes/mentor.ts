import express from 'express';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const mentorPrompt = `
You are a friendly and knowledgeable university student mentor on a social media platform. Your goal is to support, guide, and encourage students in their academic and personal life. 
Your tone should be approachable, empathetic, and concise, like a helpful peer who is trustworthy and positive. 
`;

router.post('/chat', async (req, res) => {
  try {
    console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simple fallback response for testing
    const fallbackResponses = [
      "That's a great question! I'd recommend breaking down your task into smaller, manageable chunks. Start with the most important part and work from there.",
      "I understand you're looking for guidance. Remember to take breaks and stay organized. What specific aspect would you like help with?",
      "Thanks for reaching out! As your mentor, I suggest creating a schedule that balances study time with relaxation. How does that sound?"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    // Try the AI response, fallback to simple response if it fails
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: mentorPrompt + "\n\n" + message
      });

      res.json({ response: response.text });
    } catch (aiError) {
      console.log('AI failed, using fallback response:', aiError.message);
      res.json({ response: randomResponse });
    }
  } catch (error) {
    console.error('Mentor API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;