import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Map of rapper IDs to ElevenLabs voice IDs
// You'll need to replace these with actual voice IDs from your ElevenLabs account
const voiceMap: {[key: string]: string} = {
  eminem: "zr1kFz6kFpBF8IUeG8Dd", // Replace with actual voice ID
  jayz: "Bh03t6SjOTtkTysqOi0J", // Replace with actual voice ID
  kendrick: "4VDCBJYux7UAPlF2Z1Ao", // Replace with actual voice ID
  drake: "SQIRB9ndAszhEmtJcUKr", // Replace with actual voice ID
  tupac: "LZEBlcJqjdvZKY6vPKuV", // Replace with actual voice ID
  notorious: "2dJ8kc4yvg0NyxeLD46r" // Replace with actual voice ID
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voice } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    console.log('Generating audio for voice:', voice);
    
    // Use a default voice ID if the rapper's voice isn't in our map
    const voiceId = voiceMap[voice] || "pNInz6obpgDQGcFmaJgB"; // Replace with your default voice ID
    
    console.log('Using ElevenLabs voice ID:', voiceId);
    console.log('API Key exists:', process.env.ELEVENLABS_API_KEY ? 'Yes' : 'No');
    
    // Call ElevenLabs API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        },
        responseType: 'arraybuffer'
      }
    );
    
    console.log('Audio generated successfully');
    
    // Return audio file
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(response.data);
    
  } catch (error: any) {
    console.error('Error generating audio:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    res.status(500).json({ error: 'Failed to generate audio' });
  }
}