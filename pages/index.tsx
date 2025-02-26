import { useState, FormEvent, useRef } from 'react';
import Head from 'next/head';

interface Rapper {
  id: string;
  name: string;
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [rapper, setRapper] = useState('eminem');
  const [generatedRap, setGeneratedRap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const rappers: Rapper[] = [
    { id: 'eminem', name: 'Eminem' },
    { id: 'jayz', name: 'Jay-Z' },
    { id: 'kendrick', name: 'Kendrick Lamar' },
    { id: 'drake', name: 'Drake' },
    { id: 'tupac', name: 'Tupac Shakur' },
    { id: 'notorious', name: 'The Notorious B.I.G.' }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedRap('');
    setAudioUrl(null);

    try {
      console.log('Submitting form with topic:', topic, 'and rapper:', rapper);
      
      const response = await fetch('/api/generate-rap-anthropic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, rapper }),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred');
      }

      setGeneratedRap(data.rap);
    } catch (error) {
      console.error('Error generating rap:', error);
      setGeneratedRap('Sorry, there was an error generating your rap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!generatedRap) return;
    
    setIsGeneratingAudio(true);
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: generatedRap,
          voice: rapper
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }
      
      // Create a blob from the response
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Play the audio
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio. Please try again.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Spinner component
  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Rapper AI</title>
        <meta name="description" content="Generate raps in the style of famous rappers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Rapper AI
        </h1>
        
        <p className="text-xl mb-8 text-center">
          Select a topic and your favorite rapper!
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
          <div className="mb-4">
            <label htmlFor="topic" className="block mb-2 font-medium">Topic:</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic"
              required
              className="w-full p-3 border rounded"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="rapper" className="block mb-2 font-medium">Rapper:</label>
            <select
              id="rapper"
              value={rapper}
              onChange={(e) => setRapper(e.target.value)}
              className="w-full p-3 border rounded"
            >
              {rappers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <LoadingSpinner /> 
                <span className="ml-2">Generating...</span>
              </span>
            ) : 'Generate Rap'}
          </button>
        </form>

        {isLoading && (
          <div className="w-full max-w-lg flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}

        {generatedRap && !isLoading && (
          <div className="w-full max-w-lg bg-gray-100 p-6 rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Generated Rap:</h2>
              <button
                onClick={handlePlayAudio}
                disabled={isGeneratingAudio}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center"
              >
                {isGeneratingAudio ? (
                  <span className="flex items-center">
                    <LoadingSpinner />
                    <span className="ml-2">Generating...</span>
                  </span>
                ) : 'Play 🔊'}
              </button>
            </div>
            
            {audioUrl && (
              <div className="mb-4">
                <audio ref={audioRef} controls className="w-full">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {isGeneratingAudio && !audioUrl && (
              <div className="w-full flex justify-center items-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-600"></div>
              </div>
            )}
            
            <div className="whitespace-pre-line">
              {generatedRap.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}