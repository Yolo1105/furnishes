'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageHero from '@/components/shared/ui/PageHero';
import { 
  ChatSidebar, 
  ChatArea,
  ChatInput,
  ThinkingIndicator,
  ProjectInfoPanel,
  type ChatHistoryItem,
  type Message,
  type ChatAreaMessage,
  type ProjectInfo
} from '@/components/pages/chatbot';
import type { TaskCard, FeedbackMessage } from '@/types/chat';
import type { PreferenceExtraction, PreferenceRemoval, SourceHighlight } from '@/types/preferences';
import { formatTime } from '@/utils/formatting';
import { smoothScrollTo } from '@/utils/scrollAnimation';
import { TIMEOUTS, MESSAGE } from '@/constants/business';
import styles from './ChatbotPage.module.css';

const WELCOME_MESSAGE = "Hi there! I'm Eva, your AI interior design assistant. I'm here to help you create beautiful, personalized spaces. Tell me about the room you'd like to design, your style preferences, or any specific furniture needs you have.";

const DEFAULT_SUGGESTIONS = [
  "I want to redesign my living room",
  "Help me choose a color scheme",
  "What furniture do I need for a bedroom?",
  "Suggest modern minimalist ideas",
];

const THINKING_STATUS_MESSAGES = [
  'Thinking through your design...',
  'Analyzing your preferences...',
  'Gathering inspiration for you...',
  'Sketching personalized possibilities...'
];

export default function ChatbotPage() {
  // Chat state
  const [messages, setMessages] = useState<ChatAreaMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>('chat-1');
  const [typingStatusIndex, setTypingStatusIndex] = useState(0);
  const demoResponseIndexRef = useRef(0);

  // Chat history
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: 'chat-1',
      title: 'Living Room Redesign',
      lastMessage: 'What about a sectional sofa?',
      timestamp: new Date(Date.now() - 86400000),
      isActive: true,
    },
    {
      id: 'chat-2',
      title: 'Master Bedroom',
      lastMessage: 'I love the minimalist approach',
      timestamp: new Date(Date.now() - 172800000),
      isActive: false,
    },
    {
      id: 'chat-3',
      title: 'Kitchen Renovation',
      lastMessage: 'Budget is around $15,000',
      timestamp: new Date(Date.now() - 259200000),
      isActive: false,
    },
  ]);

  // Project info
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    roomType: '',
    designStyle: '',
    budgetRange: '',
    colorTheme: [],
    mustBuyFurniture: [],
    furnitureLayout: '',
  });

  // Right panel tab
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis'>('overview');

  // Initialize with demo greeting message and first few demo responses
  useEffect(() => {
    setMessages([
      {
        id: '1',
        type: 'greeting',
        content: 'Good morning!',
        sender: 'assistant',
        timestamp: new Date(),
        isEssential: false,
      },
      {
        id: '2',
        type: 'status',
        content: 'First step is complete. Control Center Configured! This will be the central hub for managing your Workflows...',
        sender: 'assistant',
        timestamp: new Date(),
        isEssential: false,
      },
      {
        id: '3',
        type: 'text',
        content: 'Working on Workflows...',
        sender: 'assistant',
        timestamp: new Date(),
        isEssential: false,
      },
      {
        id: '4',
        type: 'taskCard',
        taskCard: {
          id: 'task-1',
          text: 'Management shift report that goes on the second line',
          isBookmarked: false,
        },
        sender: 'assistant',
        timestamp: new Date(),
        isEssential: false,
      },
      {
        id: '5',
        type: 'feedback',
        feedback: {
          text: 'This looks good',
          badge: 'U',
        },
        sender: 'user',
        timestamp: new Date(),
        isEssential: false,
      },
    ]);
    // Start demo index after the initial messages
    demoResponseIndexRef.current = 5;
  }, []);

  const formatTimeCallback = useCallback((date: Date) => {
    return formatTime(date);
  }, []);

  // Typing status rotation
  useEffect(() => {
    if (!isTyping) {
      setTypingStatusIndex(0);
      return;
    }
    const interval = window.setInterval(() => {
      setTypingStatusIndex((prev) => (prev + 1) % THINKING_STATUS_MESSAGES.length);
    }, 2400);
    return () => window.clearInterval(interval);
  }, [isTyping]);

  const currentThinkingStatus = THINKING_STATUS_MESSAGES[typingStatusIndex % THINKING_STATUS_MESSAGES.length];

  // Demo responses that cycle through different feature showcases
  const DEMO_RESPONSES: Array<{
    type: 'greeting' | 'status' | 'text' | 'taskCard' | 'feedback';
    content?: string;
    isEssential?: boolean;
    taskCard?: TaskCard;
    feedback?: FeedbackMessage;
    preferenceExtractions?: PreferenceExtraction[];
    preferenceRemovals?: PreferenceRemoval[];
    sourceHighlights?: SourceHighlight[];
    updateProjectInfo?: (prev: ProjectInfo) => ProjectInfo;
  }> = [
    {
      type: 'greeting',
      content: 'Good morning!',
    },
    {
      type: 'status',
      content: 'First step is complete. Control Center Configured! This will be the central hub for managing your Workflows...',
    },
    {
      type: 'text',
      content: 'Working on Workflows...',
    },
    {
      type: 'taskCard',
      taskCard: {
        id: 'task-1',
        text: 'Management shift report that goes on the second line',
        isBookmarked: false,
      },
    },
    {
      type: 'feedback',
      feedback: {
        text: 'This looks good',
        badge: 'U',
      },
    },
    {
      type: 'text',
      content: "Great! I've detected you're interested in designing a living room. Let me help you create the perfect space!",
      isEssential: true,
      preferenceExtractions: [
        {
          field: 'roomType',
          value: 'living room',
          confidence: 'high',
          sourceMessage: 'I want to redesign my living room',
          sourceMessageId: 'user-msg-1',
          isUpdate: false,
          timestamp: new Date(),
        },
      ],
      updateProjectInfo: (prev) => ({ ...prev, roomType: 'living room' }),
    },
    {
      type: 'text',
      content: "I see you prefer modern minimalist style. This is perfect for creating a clean, functional space. Here are some key recommendations:",
      isEssential: true,
      preferenceExtractions: [
        {
          field: 'designStyle',
          value: 'modern minimalist',
          confidence: 'high',
          sourceMessage: 'I like modern minimalist design',
          sourceMessageId: 'user-msg-2',
          isUpdate: false,
          timestamp: new Date(),
        },
      ],
      updateProjectInfo: (prev) => ({ ...prev, designStyle: 'modern minimalist' }),
    },
    {
      type: 'text',
      content: "Based on your preferences, I've identified a budget range. Let's prioritize your spending to get the most value!",
      isEssential: true,
      preferenceExtractions: [
        {
          field: 'budgetRange',
          value: '$15,000',
          confidence: 'medium',
          sourceMessage: 'My budget is around $15,000',
          sourceMessageId: 'user-msg-3',
          isUpdate: false,
          timestamp: new Date(),
        },
      ],
      updateProjectInfo: (prev) => ({ ...prev, budgetRange: '$15,000' }),
    },
    {
      type: 'taskCard',
      taskCard: {
        id: 'task-2',
        text: 'Select color scheme: neutral base with warm accent colors',
        isBookmarked: false,
      },
    },
    {
      type: 'text',
      content: "Perfect! I've updated your color preferences. The neutral base with warm accents will create a cozy yet modern atmosphere.",
      isEssential: true,
      preferenceExtractions: [
        {
          field: 'colorTheme',
          value: ['neutral', 'warm tones'],
          confidence: 'high',
          sourceMessage: 'I want neutral colors with warm accents',
          sourceMessageId: 'user-msg-4',
          isUpdate: false,
          timestamp: new Date(),
        },
      ],
      updateProjectInfo: (prev) => ({ ...prev, colorTheme: ['neutral', 'warm tones'] }),
    },
    {
      type: 'feedback',
      feedback: {
        text: 'Love the recommendations!',
        badge: 'U',
      },
    },
    {
      type: 'text',
      content: "Excellent! I've noted your furniture needs. A sectional sofa will be perfect for your living room space.",
      isEssential: true,
      preferenceExtractions: [
        {
          field: 'mustBuyFurniture',
          value: ['sectional sofa', 'coffee table'],
          confidence: 'high',
          sourceMessage: 'I need a sectional sofa and coffee table',
          sourceMessageId: 'user-msg-5',
          isUpdate: false,
          timestamp: new Date(),
        },
      ],
      updateProjectInfo: (prev) => ({ 
        ...prev, 
        mustBuyFurniture: ['sectional sofa', 'coffee table'],
      }),
    },
  ];

  // Generate demo response that cycles through feature showcases
  const generateResponse = useCallback((userMessage: string): ChatAreaMessage => {
    // Get current index and increment for next time
    const currentIndex = demoResponseIndexRef.current;
    demoResponseIndexRef.current = (demoResponseIndexRef.current + 1) % DEMO_RESPONSES.length;
    
    const response = DEMO_RESPONSES[currentIndex % DEMO_RESPONSES.length];
    
    // Update project info if needed
    if (response.updateProjectInfo) {
      setProjectInfo(response.updateProjectInfo);
    }
    
    const messageId = `demo-${Date.now()}-${currentIndex}`;
    
    return {
      id: messageId,
      type: response.type,
      content: response.content,
      sender: response.type === 'feedback' ? 'user' : 'assistant',
      timestamp: new Date(),
      isEssential: response.isEssential,
      taskCard: response.taskCard,
      feedback: response.feedback,
      preferenceExtractions: response.preferenceExtractions,
      preferenceRemovals: response.preferenceRemovals,
      sourceHighlights: response.sourceHighlights,
    };
  }, []);

  // Send message handler
  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim() || isSending || isTyping) return;

    setIsSending(true);

    // Add user message
    const userMessage: ChatAreaMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      sourceHighlights: [],
    };
    setMessages(prev => [...prev, userMessage]);

    // Update chat history
    setChatHistory(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, lastMessage: content.trim(), timestamp: new Date() }
        : chat
    ));

    // Simulate AI thinking
    setIsTyping(true);

    // Generate response after delay
    setTimeout(() => {
      const response = generateResponse(content);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      setIsSending(false);
    }, TIMEOUTS.AI_RESPONSE_MIN + Math.random() * (TIMEOUTS.AI_RESPONSE_MAX - TIMEOUTS.AI_RESPONSE_MIN));
  }, [currentChatId, generateResponse, isSending, isTyping]);

  // Chat history handlers
  const handleStartNewChat = useCallback(() => {
    const newChatId = `chat-${Date.now()}`;
    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: 'New Design Project',
      lastMessage: 'Start designing...',
      timestamp: new Date(),
      isActive: true,
    };

    setChatHistory(prev => [
      newChat,
      ...prev.map(chat => ({ ...chat, isActive: false }))
    ]);
    setCurrentChatId(newChatId);
    setMessages([
      {
        id: '1',
        content: WELCOME_MESSAGE,
        sender: 'assistant',
        timestamp: new Date(),
        isEssential: false,
      },
    ]);
    setProjectInfo({
      roomType: '',
      designStyle: '',
      budgetRange: '',
      colorTheme: [],
      mustBuyFurniture: [],
      furnitureLayout: '',
    });
  }, []);

  const handleChatSelect = useCallback((chatId: string) => {
    setChatHistory(prev => prev.map(chat => ({
      ...chat,
      isActive: chat.id === chatId
    })));
    setCurrentChatId(chatId);
    // In a real app, would load messages for this chat
  }, []);

  const handleDeleteChat = useCallback((chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      
      // If deleting the current chat and there are other chats, switch to the first one
      if (chatId === currentChatId && filtered.length > 0) {
        setCurrentChatId(filtered[0].id);
        return filtered.map((chat, idx) => ({
          ...chat,
          isActive: idx === 0
        }));
      }
      
      return filtered;
    });
  }, [currentChatId]);

  const formatDate = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  }, []);

  const getChatDescription = useCallback((chat: ChatHistoryItem) => {
    return chat.lastMessage;
  }, []);

  const scrollToChatSection = () => {
    smoothScrollTo('chat-section');
  };

  return (
    <div className={styles.chatbotPage}>
      {/* Hero Banner Cover */}
      <div className={styles.heroWrapper}>
        <PageHero
          imageSrc="/images/hero-yellow-sofa.jpg"
          imageAlt="AI Assistant hero image"
          titleLines={['Chat', 'With', 'Eva Assistant']}
          description="Your AI-powered interior design assistant to help you create the perfect space. Get personalized recommendations, design advice, and instant answers."
        />
        {/* Scroll to Chat Section Button */}
        <button 
          className={styles.scrollToChatButton}
          onClick={scrollToChatSection}
          aria-label="Scroll to chat section"
          title="Scroll to chat"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </button>
      </div>

      {/* Main Chat Section - Three Column Layout */}
      <section id="chat-section" className={styles.chatSection}>
        {/* Left Sidebar - Chat History */}
        <div className={styles.sidebarLeft}>
          <ChatSidebar
            chatHistory={chatHistory}
            currentChatId={currentChatId}
            onStartNewChat={handleStartNewChat}
            onChatSelect={handleChatSelect}
            onDeleteChat={handleDeleteChat}
            formatDate={formatDate}
            getChatDescription={getChatDescription}
          />
        </div>

        {/* Main Content - Chat Interface */}
        <div className={styles.mainContent}>
          <ChatArea
            messages={messages}
            formatTime={formatTimeCallback}
            onScrollToBottom={() => {}}
          />
          {isTyping && (
            <div style={{ padding: '0 24px 16px 24px' }}>
              <ThinkingIndicator statusText={currentThinkingStatus} />
            </div>
          )}
          <ChatInput
            chatInput={chatInput}
            setChatInput={setChatInput}
            onSendMessage={handleSendMessage}
            isSending={isSending}
            isTyping={isTyping}
            suggestions={DEFAULT_SUGGESTIONS}
            onSuggestionClick={handleSendMessage}
          />
        </div>

        {/* Right Sidebar - Project Info */}
        <div className={styles.sidebarRight}>
          <ProjectInfoPanel
            projectInfo={projectInfo}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </section>
    </div>
  );
}
