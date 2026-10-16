import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Sparkles,
  Bot,
  User,
  AlertCircle,
  ShieldAlert,
  FileText,
  X,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, VisaApplication, DocumentItem } from '../../types';
import { api } from '../../services/api';

interface AIAssistantScreenProps {
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  onClearHistory: () => void;
  activeApplication?: VisaApplication;
  documents: DocumentItem[];
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  messages,
  onSendMessage,
  onClearHistory,
  activeApplication,
  documents,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [attachedDoc, setAttachedDoc] = useState<DocumentItem | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What documents do I need for a UK visitor visa?',
    'What is proof of funds?',
    'How do I organize my visa documents?',
    'Can you explain my visa refusal letter?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedDocumentName: attachedDoc?.name,
    };

    onSendMessage(userMsg);
    setInputText('');
    const currentAttachment = attachedDoc;
    setAttachedDoc(null);
    setShowAttachMenu(false);
    setIsTyping(true);

    try {
      const context = activeApplication
        ? {
            destination: activeApplication.destination,
            category: activeApplication.visaCategory,
            stage: activeApplication.currentStage,
            attachedDoc: currentAttachment ? currentAttachment.name : undefined,
          }
        : undefined;

      const response = await api.askAssistant(query, messages, context);

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: response.source !== 'live_gemini',
      };

      onSendMessage(aiMsg);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: 'I encountered a brief connection issue. Remember to verify all official documentation directly with the relevant high commission or VAC.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: true,
      };
      onSendMessage(fallbackMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-8rem)] sm:h-[720px] bg-[#F8FAF8] relative">
      {/* Disclaimer / Model Status Bar */}
      <div className="bg-[#E5F1FA] px-4 py-2 border-b border-[#126B68]/15 flex items-center justify-between text-[11px] text-[#172B3A] shrink-0">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#126B68]" />
          <span>Visa Preparation Intelligence</span>
        </span>
        <button
          onClick={onClearHistory}
          className="text-[#697A86] hover:text-[#126B68] text-[10px] font-semibold"
        >
          Reset Chat
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              {/* Sender label and attached doc pill */}
              <div className="flex items-center gap-1.5 text-[10px] text-[#697A86] mb-1 px-1">
                <span>{isUser ? 'You' : 'VisaTrack AI'}</span>
                <span>·</span>
                <span className="font-mono">{msg.timestamp}</span>
                {msg.isDemo && (
                  <span className="text-[#126B68] bg-[#DFF4ED] px-1.5 py-0.2 rounded-sm font-semibold text-[9px]">
                    Knowledge Base
                  </span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#126B68] text-white rounded-tr-xs'
                    : 'bg-white text-[#172B3A] border border-[#126B68]/15 rounded-tl-xs'
                }`}
              >
                {/* Attached Document Indicator */}
                {msg.attachedDocumentName && (
                  <div
                    className={`mb-2 p-2 rounded-xl flex items-center gap-2 text-[11px] ${
                      isUser ? 'bg-white/15 text-white' : 'bg-[#E5F1FA] text-[#126B68]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate font-semibold">
                      Referenced Document: {msg.attachedDocumentName}
                    </span>
                  </div>
                )}

                {/* Text Content (basic markdown friendly formatting) */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.text.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>
                      {paragraph.startsWith('### ') ? (
                        <strong className="block text-sm font-bold text-[#126B68] mb-1">
                          {paragraph.replace('### ', '')}
                        </strong>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#697A86] p-2 bg-white rounded-2xl border border-[#126B68]/10 w-fit">
            <Bot className="w-4 h-4 text-[#126B68] animate-pulse" />
            <span className="italic">Reviewing visa rules and guidance...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Carousel */}
      <div className="px-4 py-2 bg-white/70 border-t border-[#126B68]/10 overflow-x-auto flex items-center gap-2 no-scrollbar shrink-0">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-[#E5F1FA] hover:bg-[#DFF4ED] text-[#126B68] text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Document Attachment Picker Dropup */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-4 right-4 bg-white rounded-2xl border border-[#126B68]/20 shadow-xl p-3 z-30 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-xs font-bold text-[#172B3A]">
              Attach Document for Analysis
            </span>
            <button
              onClick={() => setShowAttachMenu(false)}
              className="text-[#697A86] hover:text-[#172B3A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setAttachedDoc(doc);
                  setShowAttachMenu(false);
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-[#DFF4ED]/40 flex items-center gap-2 text-xs text-[#172B3A]"
              >
                <FileText className="w-3.5 h-3.5 text-[#126B68] shrink-0" />
                <span className="truncate flex-1 font-medium">{doc.name}</span>
                <span className="text-[10px] text-[#697A86]">{doc.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Input Bar */}
      <div className="p-3 bg-white border-t border-[#126B68]/10 shrink-0">
        {/* Active attachment tag */}
        {attachedDoc && (
          <div className="mb-2 bg-[#DFF4ED] px-3 py-1.5 rounded-xl flex items-center justify-between text-xs text-[#126B68]">
            <span className="flex items-center gap-1.5 truncate">
              <FileText className="w-3.5 h-3.5" />
              Attached: <strong>{attachedDoc.name}</strong>
            </span>
            <button onClick={() => setAttachedDoc(null)} className="p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="w-10 h-10 rounded-xl bg-[#F8FAF8] border border-[#126B68]/20 text-[#126B68] flex items-center justify-center hover:bg-[#DFF4ED]/50 transition-colors shrink-0"
            title="Attach a document from your vault"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask about UK/Canada requirements, funds, ties..."
            className="flex-1 h-11 px-3.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              inputText.trim() && !isTyping
                ? 'bg-[#126B68] text-white shadow-md active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Security / Legal disclaimer */}
        <p className="text-[10px] text-[#697A86] text-center mt-2">
          VisaTrack AI provides preparation guidance, not legal immigration representation or visa guarantees.
        </p>
      </div>
    </div>
  );
};
