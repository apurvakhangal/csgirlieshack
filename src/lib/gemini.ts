import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API configuration
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDR6Da2GMet_0uw8afvkAnhjQ6d7jrbiWY';
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';

if (!apiKey) {
  console.warn('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file');
}

const genAI = new GoogleGenerativeAI(apiKey);
export const geminiModel = genAI.getGenerativeModel({ model: modelName });

/**
 * Chat with Gemini AI
 */
export async function chatWithGemini(messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> {
  try {
    // Convert messages to Gemini format
    const chat = geminiModel.startChat({
      history: messages
        .slice(0, -1)
        .map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error chatting with Gemini:', error);
    throw new Error('Failed to get response from AI. Please try again.');
  }
}

/**
 * Generate a summary from text content
 */
export async function generateSummary(content: string): Promise<string> {
  try {
    const prompt = `Please provide a concise summary of the following content. Focus on key points, main concepts, and important information. Format the response with clear sections using markdown:

${content}`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary. Please try again.');
  }
}

/**
 * Generate flashcards from content
 */
export async function generateFlashcards(content: string): Promise<Array<{ question: string; answer: string }>> {
  try {
    const prompt = `Based on the following content, generate 10 flashcards in JSON format. Each flashcard should have a "question" and "answer" field. Return only valid JSON array:

Content:
${content}

Format:
[
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."}
]`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse flashcards');
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards. Please try again.');
  }
}

/**
 * Generate quiz questions from content
 */
export async function generateQuiz(content: string): Promise<Array<{
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}>> {
  try {
    const prompt = `Based on the following content, generate 10 multiple-choice quiz questions in JSON format. Each question should have:
- "question": the question text
- "options": array of 4 answer options
- "correctAnswer": index of correct answer (0-3)
- "explanation": brief explanation

Return only valid JSON array:

Content:
${content}

Format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": 0,
    "explanation": "..."
  }
]`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse quiz');
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz. Please try again.');
  }
}

/**
 * Generate a learning roadmap based on a goal
 */
export async function generateRoadmap(goal: string): Promise<Array<{
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  completed: boolean;
}>> {
  try {
    const prompt = `Create a structured learning roadmap for the following goal. Break it down into 5-8 milestones with:
- Clear, actionable titles
- Detailed descriptions
- Difficulty level (easy, medium, or hard)
- Estimated hours to complete

Goal: ${goal}

Return a JSON array with this structure:
[
  {
    "id": "1",
    "title": "...",
    "description": "...",
    "difficulty": "easy|medium|hard",
    "estimatedHours": 10,
    "completed": false
  }
]`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse roadmap');
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Failed to generate roadmap. Please try again.');
  }
}

/**
 * Translate text using Gemini (fallback if Google Translate API not available)
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const prompt = `Translate the following text to ${targetLanguage}. Return only the translated text without any additional explanation:

${text}`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error('Failed to translate text. Please try again.');
  }
}

