
import React from 'react';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, onRestart }) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const feedback = percentage >= 80 ? "Uitstekend!" : percentage >= 50 ? "Goed gedaan!" : "Blijven oefenen!";

  return (
    <div className="text-center p-8 flex flex-col items-center">
       <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{feedback}</h2>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
        Je hebt {score} van de {totalQuestions} vragen correct beantwoord.
      </p>
      
      <div className="relative w-40 h-40 mb-8">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-slate-200 dark:text-slate-700"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="text-sky-500"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-800 dark:text-white">
          {percentage}%
        </div>
      </div>

      <button
        onClick={onRestart}
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition-transform duration-300 shadow-lg"
      >
        Opnieuw Proberen
      </button>
    </div>
  );
};

export default ResultsScreen;
