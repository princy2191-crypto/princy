import React from 'react';

interface GeneratedImageProps {
  imageSrc: string | null;
  isLoading: boolean;
  error: string | null;
}

const loadingMessages = [
  "Styling the model...",
  "Setting up the lights...",
  "Finding the perfect angle...",
  "Working on the background...",
  "AI is getting creative...",
  "Almost ready for the runway...",
];

const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageSrc, isLoading, error }) => {
  const [loadingMessage, setLoadingMessage] = React.useState(loadingMessages[0]);

  React.useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleDownload = () => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'ai-model-photoshoot.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full aspect-square bg-gray-700/50 rounded-lg flex items-center justify-center p-4">
      {isLoading && (
        <div className="text-center text-gray-400">
           <svg className="animate-spin mx-auto h-12 w-12 text-purple-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-semibold text-lg">{loadingMessage}</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && !imageSrc && (
        <div className="text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 01-6.23-.693L4.2 15.3m15.6 0c1.255 0 2.25.672 2.25 1.5s-.995 1.5-2.25 1.5m-15.6 0c-1.255 0-2.25.672-2.25 1.5s.995 1.5 2.25 1.5m15.6 0V18a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 013 18v-1.2s.75-1.5 2.25-1.5M4.2 15.3V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.2s-.75-1.5-2.25-1.5" />
          </svg>
          <p className="font-semibold">Your generated image will appear here</p>
        </div>
      )}

      {imageSrc && !isLoading && (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <img src={imageSrc} alt="Generated model photoshoot" className="max-w-full max-h-[85%] object-contain rounded-md shadow-2xl" />
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Download Image</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneratedImage;
