import React, { useState, useCallback } from 'react';
import { QuizQuestion, QuizState } from './types';
import { generateQuizQuestions } from './services/geminiService';
import StartScreen from './components/StartScreen';
import ResultsScreen from './components/ResultsScreen';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.START);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleStartQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await generateQuizQuestions();
      if (fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setScore(0);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setExplanation(null);
        setQuizState(QuizState.PLAYING);
      } else {
        setError("De AI kon geen vragen genereren. Probeer het opnieuw.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een onbekende fout opgetreden.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
      setExplanation(null);
    } else {
      setExplanation(currentQuestion.explanation);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setExplanation(null);
    } else {
      setQuizState(QuizState.FINISHED);
    }
  };

  const handleRestart = () => {
    setQuizState(QuizState.START);
    setQuestions([]);
    setExplanation(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
        return (
            <div className="text-center p-8 bg-rose-100 dark:bg-rose-900/50 border border-rose-400 dark:border-rose-700 rounded-lg">
                <h2 className="text-2xl font-bold text-rose-700 dark:text-rose-300 mb-4">Fout opgetreden</h2>
                <p className="text-rose-600 dark:text-rose-400 mb-6">{error}</p>
                <button
                    onClick={handleStartQuiz}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                    Probeer opnieuw
                </button>
            </div>
        );
    }

    switch (quizState) {
      case QuizState.START:
        return <StartScreen onStart={handleStartQuiz} />;
      case QuizState.FINISHED:
        return <ResultsScreen score={score} totalQuestions={questions.length} onRestart={handleRestart} />;
      case QuizState.PLAYING:
        if (questions.length === 0) return null;
        const currentQuestion = questions[currentQuestionIndex];
        return (
            <div className="w-full">
                <div className="mb-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Vraag {currentQuestionIndex + 1} van {questions.length}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-1">
                        <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-white mb-6">{currentQuestion.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option) => {
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const isSelected = option === selectedAnswer;
                        let buttonClass = "bg-white dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300";

                        if (isAnswered) {
                            if (isCorrect) {
                                buttonClass = "bg-emerald-500 text-white";
                            } else if (isSelected && !isCorrect) {
                                buttonClass = "bg-rose-500 text-white";
                            } else {
                                buttonClass = "bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-500";
                            }
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`w-full p-4 rounded-lg text-left text-lg transition-all duration-300 shadow-md transform ${!isAnswered ? 'hover:scale-105' : ''} ${buttonClass}`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && explanation && (
                    <div className="mt-6 p-4 bg-amber-100 dark:bg-amber-900/50 border-l-4 border-amber-500 rounded-r-lg animate-fade-in">
                        <h3 className="font-bold text-lg text-amber-800 dark:text-amber-200 mb-2">Uitleg</h3>
                        <p className="text-amber-700 dark:text-amber-300">{explanation}</p>
                    </div>
                )}

                {isAnswered && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleNextQuestion}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-10 rounded-full text-lg shadow-lg"
                        >
                            {currentQuestionIndex < questions.length - 1 ? "Volgende Vraag" : "Resultaten Bekijken"}
                        </button>
                    </div>
                )}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-200 dark:border-slate-700">
        <div className="p-6 sm:p-10">
            {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default App;