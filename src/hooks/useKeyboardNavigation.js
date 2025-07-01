import { useEffect, useCallback } from 'react';

/**
 * Custom hook for keyboard navigation
 * @param {Object} options - Configuration options
 * @param {Function} options.onEnter - Callback for Enter key
 * @param {Function} options.onEscape - Callback for Escape key
 * @param {Function} options.onTab - Callback for Tab key
 * @param {Function} options.onArrowUp - Callback for Arrow Up key
 * @param {Function} options.onArrowDown - Callback for Arrow Down key
 * @param {Function} options.onArrowLeft - Callback for Arrow Left key
 * @param {Function} options.onArrowRight - Callback for Arrow Right key
 * @param {boolean} options.enabled - Whether the hook is enabled
 * @returns {Function} - Event handler function
 */
export const useKeyboardNavigation = (options = {}) => {
  const {
    onEnter,
    onEscape,
    onTab,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    enabled = true
  } = options;

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter(event);
        }
        break;
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape(event);
        }
        break;
      case 'Tab':
        if (onTab) {
          onTab(event);
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault();
          onArrowLeft(event);
        }
        break;
      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault();
          onArrowRight(event);
        }
        break;
      default:
        break;
    }
  }, [enabled, onEnter, onEscape, onTab, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);

  return handleKeyDown;
};

/**
 * Hook for managing focus within a container
 * @param {React.RefObject} containerRef - Reference to the container element
 * @param {boolean} enabled - Whether focus trapping is enabled
 */
export const useFocusTrap = (containerRef, enabled = true) => {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event) => {
      if (event.key === 'Tab') {
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
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, enabled]);
};

/**
 * Hook for managing focus restoration
 * @param {React.RefObject} elementRef - Reference to the element to focus
 * @param {boolean} shouldFocus - Whether to focus the element
 */
export const useFocusRestoration = (elementRef, shouldFocus = false) => {
  useEffect(() => {
    if (shouldFocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [shouldFocus, elementRef]);
}; 