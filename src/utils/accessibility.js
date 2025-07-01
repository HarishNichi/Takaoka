/**
 * Accessibility utility functions
 */

/**
 * Generates a meaningful aria-label from various sources
 * @param {Object} options - Options for generating aria-label
 * @param {string} options.ariaLabel - Direct aria-label
 * @param {string} options.label - Label text
 * @param {string} options.name - Field name
 * @param {string} options.placeholder - Placeholder text
 * @param {string} options.fallback - Fallback text
 * @returns {string} - Generated aria-label
 */
export const generateAriaLabel = (options = {}) => {
  const { ariaLabel, label, name, placeholder, fallback = "Input field" } = options;
  
  if (ariaLabel) return ariaLabel;
  if (label) return label;
  if (name) return name.replace(/([A-Z])/g, ' $1').toLowerCase();
  if (placeholder) return placeholder;
  return fallback;
};

/**
 * Generates a unique ID for form elements
 * @param {string} prefix - ID prefix
 * @returns {string} - Unique ID
 */
export const generateUniqueId = (prefix = 'element') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates color contrast ratio
 * @param {string} foregroundColor - Foreground color (hex)
 * @param {string} backgroundColor - Background color (hex)
 * @returns {number} - Contrast ratio
 */
export const calculateContrastRatio = (foregroundColor, backgroundColor) => {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foregroundColor);
  const bg = hexToRgb(backgroundColor);

  if (!fg || !bg) return 0;

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Checks if color contrast meets WCAG AA standards
 * @param {string} foregroundColor - Foreground color (hex)
 * @param {string} backgroundColor - Background color (hex)
 * @param {string} level - WCAG level ('AA' or 'AAA')
 * @returns {boolean} - Whether contrast meets standards
 */
export const meetsContrastStandards = (foregroundColor, backgroundColor, level = 'AA') => {
  const ratio = calculateContrastRatio(foregroundColor, backgroundColor);
  const thresholds = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  };
  
  return ratio >= thresholds[level].normal;
};

/**
 * Announces message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level ('polite' or 'assertive')
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Focuses the first focusable element in a container
 * @param {HTMLElement} container - Container element
 */
export const focusFirstElement = (container) => {
  if (!container) return;
  
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
};

/**
 * Traps focus within a container
 * @param {HTMLElement} container - Container element
 * @param {KeyboardEvent} event - Keyboard event
 */
export const trapFocus = (container, event) => {
  if (!container || event.key !== 'Tab') return;
  
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
};

/**
 * Validates form accessibility
 * @param {HTMLFormElement} form - Form element
 * @returns {Object} - Validation results
 */
export const validateFormAccessibility = (form) => {
  const issues = [];
  
  // Check for form labels
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (!input.labels || input.labels.length === 0) {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        issues.push(`Input ${input.name || input.id} lacks label or aria-label`);
      }
    }
  });
  
  // Check for error associations
  const errorMessages = form.querySelectorAll('[role="alert"], .error, .error-message');
  errorMessages.forEach(error => {
    const inputId = error.getAttribute('for') || error.getAttribute('aria-describedby');
    if (!inputId) {
      issues.push('Error message lacks association with input');
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
}; 