/**
 * Simple markdown renderer for basic formatting
 * Converts markdown to HTML for display
 */
export function renderMarkdown(text: string): string {
  if (!text) return '';
  
  let html = text;
  
  // Escape HTML first to prevent XSS
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Normalize bullet characters to hyphen for consistent parsing
  html = html.replace(/^[•‣▪◦]\s+/gm, '- ');

  // Insert line breaks before inline list markers like "include: - Item"
  html = html.replace(/([:.!?])\s+(?:[-*]|[•‣▪◦])\s+/g, '$1\n- ');
  
  // Process markdown patterns (order matters - bold before italic)
  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic: *text* (but not if it's part of **text** which we already processed)
  // Use a pattern that doesn't conflict with bold
  html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  
  // Code: `text`
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  
  // Headers: # Header, ## Header, ### Header
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Lists: - item or * item (process line by line)
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  
  for (const line of lines) {
    // Check if line starts with - or * followed by space (list item)
    const listMatch = line.match(/^[-*] (.+)$/);
    
    if (listMatch) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(`<li>${listMatch[1]}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }
  
  if (inList) {
    processedLines.push('</ul>');
  }
  
  html = processedLines.join('\n').trim();

  // Ensure block elements like lists start on their own paragraph segment
  html = html.replace(/\n(?=<\/?(?:ul|ol|h1|h2|h3|pre|code)\b)/g, '\n\n');
  
  // Limit excessive blank lines
  html = html.replace(/\n{3,}/g, '\n\n');
  
  const blockTags = ['<ul', '<ol', '<li', '<h1', '<h2', '<h3', '<code', '<pre'];
  const paragraphSegments = html.split(/\n{2,}/);
  const formattedSegments = paragraphSegments
    .map(segment => {
      const trimmed = segment.trim();
      if (!trimmed) {
        return '';
      }
      
      const startsWithBlock = blockTags.some(tag => trimmed.toLowerCase().startsWith(tag));
      if (startsWithBlock || trimmed.toLowerCase().startsWith('</')) {
        return trimmed;
      }
      
      const withBreaks = trimmed.replace(/\n/g, '<br>');
      return `<p>${withBreaks}</p>`;
    })
    .filter(Boolean);
  
  return formattedSegments.join('');
}
