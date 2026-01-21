import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI API Client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function for portfolio analysis
export const analyzePortfolio = async (portfolioData) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Analyze this portfolio: ${JSON.stringify(portfolioData)}` }],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    throw new Error('Failed to analyze portfolio');
  }
};
