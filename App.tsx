import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import GeneratedImage from './components/GeneratedImage';
import { generatePhotoshootImage } from './services/geminiService';

interface GarmentImage {
  base64: string;
  mimeType: string;
}

const App: React.FC = () => {
  const [garmentImage, setGarmentImage] = useState<GarmentImage | null>(null);
  const [designNumber, setDesignNumber] = useState<string>('');
  const [backgroundPrompt, setBackgroundPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: GarmentImage | null) => {
    setGarmentImage(file);
  }, []);

  const handleGenerateClick = async () => {
    if (!garmentImage || !backgroundPrompt.trim()) {
      setError('Please upload a garment image and provide a background description.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const fullPrompt = `Create a professional, photorealistic model photoshoot image. A model should be wearing the provided garment (design number: ${designNumber || 'N/A'}). The background should be: "${backgroundPrompt}". The model and lighting should look natural and stylish, showcasing the garment effectively.`;
      
      const imageB64 = await generatePhotoshootImage(garmentImage.base64, garmentImage.mimeType, fullPrompt);

      if (imageB64) {
        setGeneratedImage(`data:image/jpeg;base64,${imageB64}`);
      } else {
        throw new Error('The API did not return an image. Please try a different prompt.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Model Photoshoot
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Transform your garment photos into professional model shots instantly.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-gray-200 border-b border-gray-600 pb-3">1. Upload & Describe</h2>
            
            <ImageUploader onImageUpload={handleImageUpload} />
            
            <div>
              <label htmlFor="designNumber" className="block text-sm font-medium text-gray-300 mb-2">Design Number (Optional)</label>
              <input
                type="text"
                id="designNumber"
                value={designNumber}
                onChange={(e) => setDesignNumber(e.target.value)}
                placeholder="e.g., DN-2024-SUMMER-01"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            
            <div>
              <label htmlFor="backgroundPrompt" className="block text-sm font-medium text-gray-300 mb-2">
                Describe the Photoshoot Background
              </label>
              <textarea
                id="backgroundPrompt"
                rows={4}
                value={backgroundPrompt}
                onChange={(e) => setBackgroundPrompt(e.target.value)}
                placeholder="e.g., A bustling Parisian street with a cafe in the background, golden hour lighting."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !garmentImage || !backgroundPrompt.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Photoshoot'
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
             <h2 className="text-2xl font-bold text-gray-200 border-b border-gray-600 pb-3 mb-6">2. Result</h2>
             <GeneratedImage 
               imageSrc={generatedImage} 
               isLoading={isLoading} 
               error={error} 
             />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
