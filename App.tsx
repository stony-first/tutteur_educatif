import React, { useState, useEffect, useRef } from 'react';
import { Message, TopicId } from './types';
import { TOPICS } from './constants';
import { initializeChat, sendMessageStream, resetChat } from './services/geminiService';
import { TopicSelector } from './components/TopicSelector';
import { ChatMessage } from './components/ChatMessage';
import { QuizInterface } from './components/QuizInterface';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  // State
  const [currentTopic, setCurrentTopic] = useState<TopicId | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effects
  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handlers
  const handleTopicSelect = async (topicId: TopicId) => {
    setCurrentTopic(topicId);
    setQuizMode(false);
    
    resetChat(); // Reset chat history for new topic
    setMessages([]);
    setIsLoading(true);

    const topic = TOPICS.find(t => t.id === topicId);
    const primeMessage = `Bonjour. Je souhaite apprendre sur : ${topic?.title}. Peux-tu m'introduire ce sujet simplement ?`;
    
    try {
      const stream = sendMessageStream(primeMessage);
      
      let fullResponse = '';
      const messageId = Date.now().toString();
      
      setMessages([{
        id: messageId,
        role: 'model',
        content: '',
        isStreaming: true
      }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.id === messageId) {
            lastMsg.content = fullResponse;
          }
          return newMessages;
        });
      }
      
      setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg) lastMsg.isStreaming = false;
          return newMessages;
        });

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = (topicId: TopicId) => {
    setCurrentTopic(topicId);
    setQuizMode(true);
  };

  const handleDirectQuestion = async (question: string) => {
    setCurrentTopic(TopicId.GENERAL);
    setQuizMode(false);
    resetChat();
    
    const userMsgId = Date.now().toString();
    setMessages([{
      id: userMsgId,
      role: 'user',
      content: question
    }]);

    setIsLoading(true);

    try {
      const stream = sendMessageStream(question);
      const aiMsgId = (Date.now() + 1).toString();
      let fullResponse = '';

      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'model',
        content: '',
        isStreaming: true
      }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMsgs = [...prev];
          const target = newMsgs.find(m => m.id === aiMsgId);
          if (target) {
            target.content = fullResponse;
          }
          return newMsgs;
        });
      }
      
      setMessages(prev => {
        const newMsgs = [...prev];
        const target = newMsgs.find(m => m.id === aiMsgId);
        if (target) target.isStreaming = false;
        return newMsgs;
      });

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToTopics = () => {
    setCurrentTopic(null);
    setQuizMode(false);
    setMessages([]);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsgText = input.trim();
    setInput('');
    
    const newMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: newMsgId,
      role: 'user',
      content: userMsgText
    }]);

    setIsLoading(true);

    try {
      const stream = sendMessageStream(userMsgText);
      const aiMsgId = (Date.now() + 1).toString();
      let fullResponse = '';

      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'model',
        content: '',
        isStreaming: true
      }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMsgs = [...prev];
          const target = newMsgs.find(m => m.id === aiMsgId);
          if (target) {
            target.content = fullResponse;
          }
          return newMsgs;
        });
      }
      
      setMessages(prev => {
        const newMsgs = [...prev];
        const target = newMsgs.find(m => m.id === aiMsgId);
        if (target) target.isStreaming = false;
        return newMsgs;
      });

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Render logic
  const currentTopicData = TOPICS.find(t => t.id === currentTopic);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {currentTopic ? (
            <button 
              onClick={handleBackToTopics}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500 transition"
              aria-label="Retour"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
          ) : (
            <div className="text-emerald-600">
               <Icon name="Microscope" size={24} />
            </div>
          )}
          
          <h1 className="font-bold text-slate-800 text-lg md:text-xl truncate flex items-center gap-2">
            {currentTopic ? (
               <>
                 {currentTopicData?.title} 
                 {quizMode && <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">Quiz</span>}
               </>
            ) : 'BioTutor'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {!currentTopic ? (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <TopicSelector 
              onSelect={handleTopicSelect} 
              onAskQuestion={handleDirectQuestion}
              onStartQuiz={handleStartQuiz}
            />
          </div>
        ) : quizMode ? (
          /* Quiz Interface */
          <QuizInterface 
            topicId={currentTopic} 
            onClose={handleBackToTopics}
          />
        ) : (
          /* Chat Interface */
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
              <div className="max-w-3xl mx-auto pb-4">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                
                {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm ml-4">
                     <div className="animate-pulse">Réflexion en cours...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-slate-200 p-4">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question sur ce sujet..."
                    className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 pr-12 outline-none transition text-slate-800 placeholder:text-slate-400 resize-none"
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`
                      absolute right-2 bottom-2 p-2 rounded-lg transition-all
                      ${!input.trim() || isLoading 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                      }
                    `}
                  >
                    <Icon name="Send" size={18} />
                  </button>
                </form>
                <div className="text-center mt-2">
                  <p className="text-[10px] text-slate-400">
                    BioTutor peut faire des erreurs. Vérifiez les informations importantes.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;