// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (html: string): string => {
  // Simple HTML sanitization without DOMPurify dependency
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Sanitize text for logging to prevent log injection
export const sanitizeForLog = (input: string): string => {
  return input
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .substring(0, 200);
};

// Time-safe string comparison to prevent timing attacks
export const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
};

// Validate URL to prevent SSRF
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const allowedHosts = ['localhost', '127.0.0.1', 'cleopatraregalos.com'];
    const blockedHosts = ['169.254.169.254', '0.0.0.0'];
    
    if (blockedHosts.includes(urlObj.hostname)) {
      return false;
    }
    
    return allowedHosts.some(host => urlObj.hostname.includes(host)) || 
           urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Escape HTML entities
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};