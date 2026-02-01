import React, { useState } from 'react';
import { TOPICS } from '../constants';
import { TopicId } from '../types';
import { Icon } from './Icon';

interface TopicSelectorProps {
  onSelect: (topicId: TopicId) => void;
  onAskQuestion: (question: string) => void;
  onStartQuiz: (topicId: TopicId) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect, onAskQuestion, onStartQuiz }) => {
  const [filterTerm, setFilterTerm] = useState('');
  const [question, setQuestion] = useState('');

  const filteredTopics = TOPICS.filter(topic => 
    topic.title.toLowerCase().includes(filterTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onAskQuestion(question.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      
      {/* Hero / Main Search Section */}
      <div className="text-center mb-16 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Votre Tuteur en Physiologie
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Posez n'importe quelle question sur le corps humain ou choisissez un cours structuré.
        </p>

        <form onSubmit={handleQuestionSubmit} className="relative max-w-2xl mx-auto group z-20">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-emerald-600">
            <Icon name="Bot" size={24} />
          </div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: Pourquoi mon cœur bat plus vite quand je cours ?"
            className="w-full bg-white border-2 border-emerald-100 rounded-2xl py-5 pl-14 pr-14 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-lg hover:shadow-xl"
          />
          <button 
            type="submit"
            disabled={!question.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Send" size={20} />
          </button>
        </form>
      </div>

      {/* Course Catalog Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Icon name="BookOpen" size={24} className="text-slate-400" />
              Catalogue des Cours
            </h2>
            <p className="text-slate-500 text-sm mt-1">Sélectionnez un module pour commencer</p>
          </div>

          {/* Topic Filter */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon name="Search" size={16} />
            </div>
            <input
              type="text"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              placeholder="Filtrer les sujets..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
        </div>
        
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className={`
                  group relative flex flex-col text-left p-6 rounded-2xl border transition-all duration-300
                  ${topic.color} bg-opacity-30 border-transparent hover:border-current hover:shadow-lg hover:-translate-y-1 overflow-hidden
                `}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                   <Icon name={topic.icon} size={80} />
                </div>

                <div className="relative z-10 w-full flex-1 flex flex-col">
                  <div className="mb-4 p-3 bg-white bg-opacity-80 rounded-xl shadow-sm inline-flex backdrop-blur-sm self-start">
                    <Icon name={topic.icon} size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800 group-hover:text-black">{topic.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed font-medium text-slate-700 flex-1 mb-6">
                    {topic.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button 
                       onClick={() => onSelect(topic.id)}
                       className="flex items-center justify-center gap-2 bg-white/70 hover:bg-white text-slate-800 font-bold py-2.5 px-4 rounded-lg text-xs md:text-sm transition shadow-sm backdrop-blur-sm"
                    >
                       <Icon name="BookOpen" size={16} />
                       Cours
                    </button>
                    <button 
                       onClick={() => onStartQuiz(topic.id)}
                       className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg text-xs md:text-sm hover:bg-emerald-700 transition shadow-md"
                    >
                       <Icon name="Award" size={16} />
                       Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Icon name="Search" size={24} />
            </div>
            <h3 className="text-base font-medium text-slate-900">Aucun cours trouvé</h3>
            <button 
              onClick={() => setFilterTerm('')}
              className="mt-2 text-sm text-emerald-600 font-semibold hover:underline"
            >
              Réinitialiser le filtre
            </button>
          </div>
        )}
      </div>
    </div>
  );
};