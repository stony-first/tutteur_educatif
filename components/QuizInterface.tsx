import React, { useState, useEffect } from 'react';
import { QuizQuestion, TopicId } from '../types';
import { TOPICS } from '../constants';
import { Icon } from './Icon';
import { generateQuizQuestions } from '../services/geminiService';

interface QuizInterfaceProps {
  topicId: TopicId;
  onClose: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ topicId, onClose }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topicData = TOPICS.find(t => t.id === topicId);

  useEffect(() => {
    loadQuiz();
  }, [topicId]);

  const loadQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const qs = await generateQuizQuestions(topicData?.title || "Biologie Humaine");
      setQuestions(qs);
    } catch (e) {
      setError("Impossible de charger le quiz. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setIsAnswered(false);
    setSelectedOption(null);
    loadQuiz();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="animate-spin text-emerald-600 mb-4">
          <Icon name="RotateCcw" size={40} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Préparation de votre quiz...</h2>
        <p className="text-slate-500">L'IA génère des questions sur {topicData?.title}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-red-500 mb-4"><Icon name="XCircle" size={40} /></div>
        <p className="text-slate-800 mb-4">{error}</p>
        <button onClick={onClose} className="text-emerald-600 font-bold underline">Retour</button>
      </div>
    );
  }

  if (isFinished) {
    const percentage = (score / questions.length) * 100;
    let feedback = "";
    if (percentage === 100) feedback = "Excellent ! Maîtrise parfaite.";
    else if (percentage >= 80) feedback = "Très bien ! Encore un petit effort.";
    else if (percentage >= 50) feedback = "Pas mal, mais des révisions sont nécessaires.";
    else feedback = "Il faut revoir ce chapitre.";

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-emerald-100 p-6 rounded-full text-emerald-600 mb-6">
          <Icon name="Award" size={64} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Terminé !</h2>
        <p className="text-xl text-slate-600 mb-8">Votre score : <span className="font-bold text-emerald-600">{score} / {questions.length}</span></p>
        
        <p className="text-slate-700 italic mb-8">"{feedback}"</p>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
          >
            Changer de sujet
          </button>
          <button 
            onClick={handleRetry}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-md transition flex items-center gap-2"
          >
            <Icon name="RotateCcw" size={18} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Question {currentQuestionIndex + 1} / {questions.length}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <Icon name="X" size={24} />
        </button>
      </div>

      {/* Question Card */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
          {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctAnswerIndex;
            
            let statusClass = "border-slate-200 hover:border-emerald-300 hover:bg-slate-50";
            if (isAnswered) {
              if (isCorrect) statusClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
              else if (isSelected) statusClass = "border-red-500 bg-red-50 text-red-800";
              else statusClass = "border-slate-100 opacity-60";
            } else if (isSelected) {
              statusClass = "border-emerald-500 bg-emerald-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group ${statusClass}`}
              >
                <span className="text-base md:text-lg font-medium">{option}</span>
                {isAnswered && isCorrect && <Icon name="CheckCircle" className="text-emerald-600" size={24} />}
                {isAnswered && isSelected && !isCorrect && <Icon name="XCircle" className="text-red-500" size={24} />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold">
              <Icon name="HelpCircle" size={20} />
              Explication
            </div>
            <p className="text-blue-900 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:static md:bg-transparent md:border-0 md:p-0 mt-4">
        <div className="max-w-3xl mx-auto flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all
              ${isAnswered 
                ? 'bg-emerald-600 hover:bg-emerald-700 hover:translate-x-1' 
                : 'bg-slate-300 cursor-not-allowed'}
            `}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Voir les résultats' : 'Suivant'}
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};