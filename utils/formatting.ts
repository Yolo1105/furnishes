// Date formatting utilities
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
};

// Time formatting utilities
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Text formatting
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string | null | undefined): string => {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Project-specific formatting utilities
export const renderField = (value: string | string[], label: string): string => {
  if (Array.isArray(value)) {
    if (value.includes("Any")) return `Any ${label}`;
    if (value.length === 0) return `To be determined`;
    return value.join(', ');
  }
  if (value === "Any") return `Any ${label}`;
  if (!value || value.trim() === "") return `To be determined`;
  return value;
};

// Chat description generation
export const generateChatDescription = (
  projectInfo: {
    roomType?: string | any;
    designStyle?: string | any;
    budgetRange?: string | any;
  },
  lastMessage?: string
): string => {
  // Helper to safely extract string value
  const getStringValue = (value: any): string | null => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && 'value' in value) {
      return typeof value.value === 'string' ? value.value : null;
    }
    return null;
  };

  const roomType = getStringValue(projectInfo.roomType);
  const designStyle = getStringValue(projectInfo.designStyle);

  if (roomType && roomType !== 'To be determined') {
    const capitalizedRoom = capitalizeFirst(roomType);
    
    if (designStyle && designStyle !== 'To be determined') {
      return `${capitalizedRoom} • ${designStyle} design`;
    }
    
    return `${capitalizedRoom} design project`;
  }
  
  // Fallback to last message preview
  if (lastMessage) {
    const words = lastMessage.split(' ').slice(0, 6);
    return words.join(' ') + (words.length >= 6 ? '...' : '');
  }
  
  return 'Click to view conversation';
};
