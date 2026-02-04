
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const UltrasoundIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V2l-3.5 3.5" />
        <path d="M15.5 10.5c-3-2-6-2-9 0" />
        <path d="M18.5 13.5c-4-3-8-3-12 0" />
        <path d="M21.5 16.5c-5-4-10-4-15 0" />
        <path d="M21.5 22H16c-1.7 0-3-1.3-3-3V9" />
        <path d="M13 9H4.5" />
        <path d="M4.5 9L2 22" />
    </svg>
);


const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center p-8">
      <UltrasoundIcon />
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
        Kennistoets Musculoskeletale Echografie
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
        Test uw kennis op masterniveau met AI-gegenereerde vragen over geavanceerde MSK-echografie onderwerpen.
      </p>
      <button
        onClick={onStart}
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full text-xl transform hover:scale-105 transition-transform duration-300 shadow-lg"
      >
        Start de Quiz
      </button>
    </div>
  );
};

export default StartScreen;
