import React, { useState } from 'react';
import { Icon } from './Icon';

interface ApiKeyModalProps {
  onSubmit: (key: string) => void;
  onCancel?: () => void;
  canCancel: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit, onCancel, canCancel }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {canCancel && onCancel && (
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <Icon name="X" size={20} />
          </button>
        )}
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <Icon name="Settings" size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Configuration API</h2>
        </div>

        <p className="text-slate-600 mb-6 text-sm">
          Pour utiliser ce tuteur de biologie, vous avez besoin d'une clé API Google Gemini.
          Cette clé n'est stockée que dans votre navigateur.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase mb-1">
              Clé API Gemini
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition shadow-md"
          >
            Commencer
          </button>
        </form>
        
        <div className="mt-4 text-xs text-center text-slate-400">
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-emerald-600">
            Obtenir une clé ici
          </a>
        </div>
      </div>
    </div>
  );
};