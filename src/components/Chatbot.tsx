import React, { useState, useEffect, useRef } from 'react';
import { chatbotAPI } from '../services/api';
import './Chatbot.css';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openChatbot', handleOpenChatbot);
  }, []);

  useEffect(() => {
    // Initial welcome message
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        text: "Hello! I'm your MediCare assistant. I'm powered by Gemini and I can help you with medicine orders, blood bank queries, and general health information. How can I assist you today?",
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const currentInput = inputText;
    const userMessage: Message = {
      id: Date.now(),
      text: currentInput,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await chatbotAPI.sendMessage(currentInput);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: res.data.text,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting to my service. Please make sure the backend is running and the API key is configured.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <span className="chatbot-icon">🤖</span>
            MediCare Assistant
          </div>
          <button 
            className="chatbot-close"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.isBot ? 'bot' : 'user'}`}
            >
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-content typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chatbot-input">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>
    </>
  );
};

export default Chatbot;
