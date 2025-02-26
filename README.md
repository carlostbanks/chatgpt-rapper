Rapper AI
Rapper AI is an interactive web application that generates custom rap verses in the style of famous rappers. Built with Next.js and powered by AI language models, it can create original lyrics about any topic and even convert them to spoken audio.
Features

Generate rap verses in the style of popular rappers (Eminem, Jay-Z, Kendrick Lamar, etc.)
Choose any topic for your custom rap
Convert generated lyrics to speech with voice synthesis
Clean, responsive UI built with Tailwind CSS

How to Use

Enter a topic in the input field (e.g., "money", "technology", "friendship")
Select a rapper from the dropdown menu
Click "Generate Rap" to create your custom verse
Once generated, click "Play" to hear the rap performed in a voice similar to the selected artist

Installation and Setup
Prerequisites

Node.js v14.15.1 or compatible version
npm or yarn
Anthropic API key (for text generation)
ElevenLabs API key (for voice synthesis)

Getting Started

Clone the repository:
bashCopygit clone https://github.com/your-username/rapper-ai.git
cd rapper-ai

Install dependencies:
bashCopynpm install

Create a .env.local file in the root directory with your API keys:
CopyANTHROPIC_API_KEY=your_anthropic_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

Start the development server:
bashCopynpm run dev
# or
yarn dev

Open http://localhost:3000 in your browser to see the application.

Technologies Used

Frontend: Next.js, React, Tailwind CSS
Text Generation: Anthropic's Claude API
Voice Synthesis: ElevenLabs API
Deployment: Vercel (recommended)

Project Structure

pages/index.tsx: Main application UI
pages/api/generate-rap-anthropic.ts: API endpoint for generating rap lyrics using Anthropic's Claude
pages/api/generate-audio.ts: API endpoint for converting text to speech using ElevenLabs
styles/: CSS and styling files

Customization
Adding New Rappers
To add more rappers to the selection menu, modify the rappers array in pages/index.tsx:
typescriptCopyconst rappers: Rapper[] = [
  { id: 'eminem', name: 'Eminem' },
  { id: 'jayz', name: 'Jay-Z' },
  // Add your new rapper here
  { id: 'new-rapper-id', name: 'New Rapper Name' },
];
Then update the style mappings in pages/api/generate-rap-anthropic.ts.
Voice Customization
To customize the voices used for audio generation, update the voiceMap in pages/api/generate-audio.ts with your own ElevenLabs voice IDs.
Deployment
This project is ready to be deployed on Vercel:

Push your code to a GitHub repository
Connect your repository to Vercel
Add your environment variables (API keys) in the Vercel dashboard
Deploy!

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.
Limitations

Voice synthesis quality depends on the available voice models
API usage may incur costs depending on your Anthropic and ElevenLabs plans
The app requires internet connectivity to function

Learn More
To learn more about the technologies used:

Next.js Documentation - learn about Next.js features and API
Anthropic's Claude API - for text generation
ElevenLabs API - for voice synthesis
Tailwind CSS - for styling

License
MIT
Acknowledgements

Built with Next.js
Text generation powered by Anthropic's Claude
Voice synthesis by ElevenLabs