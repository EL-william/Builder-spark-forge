/**
 * DOM manipulation utilities in plain JavaScript
 * These functions provide common DOM operations and utilities
 */

/**
 * Add event listener with cleanup
 * @param {Element} element - DOM element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @returns {Function} Cleanup function
 */
export function addEventListener(element, event, handler) {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Get element position relative to viewport
 * @param {Element} element - DOM element
 * @returns {Object} Position object with x, y, width, height
 */
export function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right,
  };
}

/**
 * Check if element is visible in viewport
 * @param {Element} element - DOM element
 * @returns {boolean} True if element is visible
 */
export function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

/**
 * Smooth scroll to element
 * @param {Element} element - Element to scroll to
 * @param {Object} options - Scroll options
 */
export function scrollToElement(element, options = {}) {
  const defaultOptions = {
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  };

  element.scrollIntoView({ ...defaultOptions, ...options });
}

/**
 * Create DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string} children - Child elements or text content
 * @returns {Element} Created DOM element
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "style" && typeof value === "object") {
      Object.assign(element.style, value);
    } else if (key.startsWith("data-")) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });

  // Add children
  if (typeof children === "string") {
    element.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Element) {
        element.appendChild(child);
      }
    });
  }

  return element;
}

/**
 * Remove all children from element
 * @param {Element} element - Parent element
 */
export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Add CSS class with animation support
 * @param {Element} element - DOM element
 * @param {string} className - CSS class name
 * @param {number} duration - Animation duration (optional)
 */
export function addClassWithAnimation(element, className, duration = 300) {
  element.classList.add(className);

  if (duration > 0) {
    element.style.transition = `all ${duration}ms ease-in-out`;

    setTimeout(() => {
      element.style.transition = "";
    }, duration);
  }
}

/**
 * Remove CSS class with animation support
 * @param {Element} element - DOM element
 * @param {string} className - CSS class name
 * @param {number} duration - Animation duration (optional)
 */
export function removeClassWithAnimation(element, className, duration = 300) {
  if (duration > 0) {
    element.style.transition = `all ${duration}ms ease-in-out`;

    setTimeout(() => {
      element.classList.remove(className);
      element.style.transition = "";
    }, duration);
  } else {
    element.classList.remove(className);
  }
}

/**
 * Toggle CSS class with animation support
 * @param {Element} element - DOM element
 * @param {string} className - CSS class name
 * @param {number} duration - Animation duration (optional)
 * @returns {boolean} True if class was added, false if removed
 */
export function toggleClassWithAnimation(element, className, duration = 300) {
  if (element.classList.contains(className)) {
    removeClassWithAnimation(element, className, duration);
    return false;
  } else {
    addClassWithAnimation(element, className, duration);
    return true;
  }
}

/**
 * Wait for DOM element to appear
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Element>} Promise that resolves with the element
 */
export function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);

    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Get computed style property value
 * @param {Element} element - DOM element
 * @param {string} property - CSS property name
 * @returns {string} Computed property value
 */
export function getComputedStyleProperty(element, property) {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Check if element matches media query
 * @param {string} query - Media query string
 * @returns {boolean} True if query matches
 */
export function matchesMediaQuery(query) {
  return window.matchMedia(query).matches;
}

/**
 * Get device type based on screen size
 * @returns {string} Device type: 'mobile', 'tablet', or 'desktop'
 */
export function getDeviceType() {
  if (matchesMediaQuery("(max-width: 767px)")) {
    return "mobile";
  } else if (matchesMediaQuery("(max-width: 1023px)")) {
    return "tablet";
  } else {
    return "desktop";
  }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Promise that resolves with success status
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy text:", error);
    return false;
  }
}

/**
 * Export all functions as default object
 */
export default {
  addEventListener,
  debounce,
  throttle,
  getElementPosition,
  isElementVisible,
  scrollToElement,
  createElement,
  clearElement,
  addClassWithAnimation,
  removeClassWithAnimation,
  toggleClassWithAnimation,
  waitForElement,
  getComputedStyleProperty,
  matchesMediaQuery,
  getDeviceType,
  copyToClipboard,
};
