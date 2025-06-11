/**
 * Help page interactive functionality
 * Plain JavaScript for help page features
 */

document.addEventListener("DOMContentLoaded", function () {
  initializeHelpPage();
});

/**
 * Initialize help page functionality
 */
function initializeHelpPage() {
  setupSmoothScrolling();
  setupNavigationHighlight();
  setupSearchFunctionality();
  setupPrintButton();
  setupKeyboardShortcuts();
  setupBackToTop();
}

/**
 * Setup smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('.help-nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerOffset = 120; // Account for sticky nav
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update URL without jumping
        history.pushState(null, null, `#${targetId}`);

        // Highlight the section
        highlightSection(targetElement);
      }
    });
  });
}

/**
 * Highlight a section when navigated to
 */
function highlightSection(element) {
  // Remove existing highlights
  document.querySelectorAll(".help-section.highlighted").forEach((section) => {
    section.classList.remove("highlighted");
  });

  // Add highlight to current section
  element.classList.add("highlighted");

  // Add CSS for highlight effect
  if (!document.querySelector("#highlight-styles")) {
    const style = document.createElement("style");
    style.id = "highlight-styles";
    style.textContent = `
            .help-section.highlighted {
                animation: highlight-pulse 2s ease-in-out;
            }
            
            @keyframes highlight-pulse {
                0% { background-color: transparent; }
                50% { background-color: rgba(79, 70, 229, 0.1); }
                100% { background-color: transparent; }
            }
        `;
    document.head.appendChild(style);
  }

  // Remove highlight after animation
  setTimeout(() => {
    element.classList.remove("highlighted");
  }, 2000);
}

/**
 * Setup navigation link highlighting based on scroll position
 */
function setupNavigationHighlight() {
  const sections = document.querySelectorAll(".help-section");
  const navLinks = document.querySelectorAll('.help-nav a[href^="#"]');

  function updateActiveNavLink() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 150) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // Add active link styles
  const style = document.createElement("style");
  style.textContent = `
        .help-nav a.active {
            color: #4f46e5 !important;
            background: #eef2ff !important;
            font-weight: 600;
        }
    `;
  document.head.appendChild(style);

  window.addEventListener("scroll", throttle(updateActiveNavLink, 100));
  updateActiveNavLink(); // Initial call
}

/**
 * Add search functionality to help content
 */
function setupSearchFunctionality() {
  // Create search box
  const searchContainer = document.createElement("div");
  searchContainer.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: none;
        " id="search-box">
            <input type="text" placeholder="Поиск по справке..." style="
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                width: 250px;
                font-size: 14px;
            " id="search-input">
            <button onclick="clearSearch()" style="
                margin-left: 8px;
                padding: 8px 12px;
                background: #f3f4f6;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                cursor: pointer;
            ">✕</button>
        </div>
    `;
  document.body.appendChild(searchContainer);

  const searchBox = document.getElementById("search-box");
  const searchInput = document.getElementById("search-input");

  // Show search on Ctrl+F or Cmd+F
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      searchBox.style.display = "block";
      searchInput.focus();
    }

    if (e.key === "Escape") {
      searchBox.style.display = "none";
      clearSearch();
    }
  });

  // Search functionality
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const textNodes = getTextNodes(document.querySelector(".help-content"));

    // Clear previous highlights
    clearHighlights();

    if (query.length > 2) {
      highlightMatches(textNodes, query);
    }
  });
}

/**
 * Get all text nodes in an element
 */
function getTextNodes(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false,
  );

  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim()) {
      textNodes.push(node);
    }
  }

  return textNodes;
}

/**
 * Highlight matching text
 */
function highlightMatches(textNodes, query) {
  textNodes.forEach((node) => {
    const text = node.textContent;
    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");

    if (regex.test(text)) {
      const highlightedText = text.replace(
        regex,
        '<mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">$1</mark>',
      );
      const wrapper = document.createElement("span");
      wrapper.innerHTML = highlightedText;
      node.parentNode.replaceChild(wrapper, node);
    }
  });
}

/**
 * Clear search highlights
 */
function clearHighlights() {
  document.querySelectorAll("mark").forEach((mark) => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

/**
 * Clear search and hide search box
 */
function clearSearch() {
  document.getElementById("search-input").value = "";
  document.getElementById("search-box").style.display = "none";
  clearHighlights();
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Add print button functionality
 */
function setupPrintButton() {
  // Create print button
  const printButton = document.createElement("button");
  printButton.innerHTML = "🖨️ Печать";
  printButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4f46e5;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;

  printButton.addEventListener("click", function () {
    window.print();
  });

  printButton.addEventListener("mouseover", function () {
    this.style.background = "#4338ca";
    this.style.transform = "translateY(-2px)";
  });

  printButton.addEventListener("mouseout", function () {
    this.style.background = "#4f46e5";
    this.style.transform = "translateY(0)";
  });

  document.body.appendChild(printButton);
}

/**
 * Setup keyboard shortcuts for help page
 */
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", function (e) {
    // Don't trigger shortcuts when typing in input fields
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    switch (e.key.toLowerCase()) {
      case "h":
        if (!e.ctrlKey && !e.metaKey) {
          scrollToTop();
        }
        break;
      case "g":
        if (!e.ctrlKey && !e.metaKey) {
          document.getElementById("getting-started").scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        break;
      case "e":
        if (!e.ctrlKey && !e.metaKey) {
          document.getElementById("events").scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        break;
      case "t":
        if (!e.ctrlKey && !e.metaKey) {
          document.getElementById("tasks").scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        break;
    }
  });

  // Show keyboard shortcuts info
  const shortcutInfo = document.createElement("div");
  shortcutInfo.innerHTML = `
        <div style="
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 6px;
            font-size: 12px;
            display: none;
            z-index: 1001;
        " id="shortcuts-info">
            H - В начало<br>
            G - Начало работы<br>
            E - События<br>
            T - Задачи<br>
            Ctrl+F - Поиск
        </div>
    `;
  document.body.appendChild(shortcutInfo);

  // Show shortcuts on ? key
  document.addEventListener("keydown", function (e) {
    if (e.key === "?") {
      const info = document.getElementById("shortcuts-info");
      info.style.display = info.style.display === "none" ? "block" : "none";
    }
  });
}

/**
 * Setup back to top functionality
 */
function setupBackToTop() {
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = "↑";
  backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0,0,0,0.7);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
    `;

  backToTopButton.addEventListener("click", scrollToTop);

  document.body.appendChild(backToTopButton);

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/**
 * Throttle function to limit how often a function can be called
 */
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Add loading animation for page load
 */
function addLoadingAnimation() {
  const sections = document.querySelectorAll(".help-section");

  sections.forEach((section, index) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "all 0.6s ease";

    setTimeout(() => {
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// Initialize loading animation
document.addEventListener("DOMContentLoaded", addLoadingAnimation);

// Global functions for inline handlers
window.clearSearch = clearSearch;
