import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Define rapper styles mapping
const rapperStyles: {[key: string]: string} = {
  eminem: "complex rhymes, fast flow, aggressive tone, personal stories, and witty wordplay",
  jayz: "smooth flow, clever wordplay, street narratives, and business references",
  kendrick: "deep storytelling, conscious lyrics, jazz influences, and varied vocal tones",
  drake: "melodic delivery, emotional vulnerability, quotable lines, and pop culture references",
  tupac: "passionate delivery, social commentary, thug life philosophy, and emotional depth",
  notorious: "smooth flow, vivid storytelling, clever wordplay, and laid-back confidence"
};

// Define rapper names mapping
const rapperNames: {[key: string]: string} = {
  eminem: "Eminem",
  jayz: "Jay-Z",
  kendrick: "Kendrick Lamar",
  drake: "Drake",
  tupac: "Tupac Shakur",
  notorious: "The Notorious B.I.G."
};

type RapResponse = {
  rap?: string;
  error?: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RapResponse>
) {
  console.log('API handler called with method:', req.method);
  
  // Return 405 for non-POST methods
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, rapper } = req.body;
  console.log('Received request with topic:', topic, 'and rapper:', rapper);

  // Validate request body
  if (!topic || !rapper) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Topic and rapper are required' });
  }

  try {
    const rapperStyle = rapperStyles[rapper] || "unique rap style";
    const rapperName = rapperNames[rapper] || rapper;

    console.log('Building prompt for:', rapperName);
    const prompt = `Write a rap verse about ${topic} in the style of ${rapperName}. 
    Capture their ${rapperStyle}. 
    The rap should be 16 bars (lines) long, with rhyming patterns typical of ${rapperName}.
    Be authentic to their voice, flow, and typical themes while focusing on the topic of ${topic}.`;

    console.log('Preparing to call Anthropic API...');

    // Make a direct request to the Anthropic API using axios
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Anthropic API response received');
    let rap = response.data.content[0]?.text || "No content generated";

    // Filter out introductory text
    rap = rap.replace(/^(Here is |I'll create |This is |Here's |Writing |Let me write |I've written |I wrote ).*?(rap verse|verse|rap|lyrics).*?:/i, '').trim();
        
    console.log('Rap generated successfully');
    res.status(200).json({ rap });
  } catch (error: any) {
    console.error('Error generating rap:', error.message);
    
    // Log more details about the error
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    res.status(500).json({ 
      error: 'Failed to generate rap', 
      details: error.message || "Unknown error occurred"
    });
  }
}