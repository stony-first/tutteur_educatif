import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Icon } from './Icon';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${isUser ? 'bg-slate-800 text-white' : 'bg-emerald-600 text-white'}`}>
          <Icon name={isUser ? 'User' : 'Bot'} size={20} />
        </div>

        {/* Bubble */}
        <div className={`
          flex flex-col p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed
          ${isUser 
            ? 'bg-slate-800 text-white rounded-tr-none' 
            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
          }
        `}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
             <div className="prose prose-sm md:prose-base prose-slate max-w-none dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};