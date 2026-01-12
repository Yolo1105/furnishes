import React from 'react';
import type { SourceHighlight } from '@/types/preferences';
import styles from './SourceHighlightedMessage.module.css';

interface SourceHighlightedMessageProps {
  message: string;
  highlights: SourceHighlight[];
}

export const SourceHighlightedMessage: React.FC<SourceHighlightedMessageProps> = ({
  message,
  highlights
}) => {
  if (!highlights || highlights.length === 0) {
    return <span>{message}</span>;
  }

  // Sort highlights by start index
  const sortedHighlights = [...highlights].sort((a, b) => a.startIndex - b.startIndex);

  // Build array of text segments with highlights
  const segments: Array<{ text: string; highlight?: SourceHighlight }> = [];
  let lastIndex = 0;

  sortedHighlights.forEach((highlight) => {
    // Add text before highlight
    if (highlight.startIndex > lastIndex) {
      segments.push({
        text: message.substring(lastIndex, highlight.startIndex)
      });
    }

    // Add highlighted text
    segments.push({
      text: message.substring(highlight.startIndex, highlight.endIndex),
      highlight
    });

    lastIndex = highlight.endIndex;
  });

  // Add remaining text
  if (lastIndex < message.length) {
    segments.push({
      text: message.substring(lastIndex)
    });
  }

  return (
    <span className={styles.highlightedMessage}>
      {segments.map((segment, idx) => {
        if (segment.highlight) {
          return (
            <span
              key={idx}
              className={styles.highlight}
              data-field={segment.highlight.field}
              title={`Extracted as: ${segment.highlight.extractedAs} (${segment.highlight.field})`}
            >
              {segment.text}
            </span>
          );
        }
        return <span key={idx}>{segment.text}</span>;
      })}
    </span>
  );
};
