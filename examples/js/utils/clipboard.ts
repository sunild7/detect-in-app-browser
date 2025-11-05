/**
 * Clipboard utility functions
 * Handles copying text to clipboard with multiple fallback methods
 */

/**
 * Copy text to clipboard with multiple fallback methods
 * 
 * @param {string} text - Text to copy
 * @param {HTMLElement | null} feedbackElement - Element to show feedback on
 * @returns {Promise<boolean>} True if copy succeeded
 */
export async function copyToClipboard(
  text: string,
  feedbackElement: HTMLElement | null = null
): Promise<boolean> {
  // Attempt 1: Async Clipboard API (modern, preferred)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      showCopyFeedback(feedbackElement);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, falling back:', err);
    }
  }

  // Attempt 2: execCommand('copy') fallback
  try {
    const success = await execCommandCopy(text);
    if (success) {
      showCopyFeedback(feedbackElement);
      return true;
    }
  } catch (err) {
    console.warn('execCommand fallback failed:', err);
  }

  // Attempt 3: prompt as last resort
  tryPromptFallback(text, feedbackElement);
  return false;
}

/**
 * Copy using execCommand (legacy method)
 */
function execCommandCopy(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.style.opacity = '0';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      resolve(successful);
    } catch (err) {
      console.error('execCommand copy failed:', err);
      resolve(false);
    }
  });
}

/**
 * Show prompt as last resort fallback
 */
function tryPromptFallback(text: string, feedbackElement: HTMLElement | null): void {
  try {
    window.prompt('Copy User Agent (Ctrl+C / Cmd+C):', text);
    showCopyFeedback(feedbackElement, true);
  } catch (err) {
    console.error('Prompt fallback failed:', err);
  }
}

/**
 * Show visual feedback when text is copied
 */
function showCopyFeedback(element: HTMLElement | null, isManual: boolean = false): void {
  if (!element) return;

  const originalText = element.textContent || '';
  const originalBackground = element.style.background;

  element.textContent = isManual ? 'Shown to Copy' : 'Copied!';
  element.style.background = '#28a745';
  element.style.transition = 'background-color 0.2s ease';

  setTimeout(() => {
    if (element) {
      element.textContent = originalText;
      element.style.background = originalBackground;
    }
  }, 2000);
}

