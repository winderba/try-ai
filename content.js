// Function to check if we're on a Google search page
function isGoogleSearchPage() {
  return window.location.hostname.includes('google.com') && 
    (window.location.pathname === '/' || window.location.pathname.includes('/search'));
}

// Function to check if we're on an AI platform page
function isAIPlatformPage() {
  return window.location.hostname.includes('chat.openai.com') || 
         window.location.hostname.includes('gemini.google.com') || 
         window.location.hostname.includes('claude.ai');
}

// Function to get the current search query from Google
function getGoogleSearchQuery() {
  // Look for the search input field
  const searchInput = document.querySelector('input[name="q"]');
  return searchInput ? searchInput.value : '';
}

// AI options with their names, URLs, and colors
const aiOptions = [
  { 
    name: 'ChatGPT', 
    url: 'https://chat.openai.com', 
    color: 'linear-gradient(135deg, #0f9f7b, #10a37f)'
  },
  { 
    name: 'Gemini', 
    url: 'https://gemini.google.com', 
    color: 'linear-gradient(135deg, #4776e6, #8e54e9)'
  },
  { 
    name: 'Claude', 
    url: 'https://claude.ai', 
    color: 'linear-gradient(135deg, #e65c00, #F9D423)'
  }
];

// Function to load user's preferred AI
function getPreferredAI(callback) {
  chrome.storage.local.get(['preferredAI'], function(result) {
    // Default to ChatGPT if no preference is set
    callback(result.preferredAI || 'ChatGPT');
  });
}

// Function to save user's preferred AI
function savePreferredAI(aiName) {
  chrome.storage.local.set({preferredAI: aiName});
}

// Function to show the paste notification
function showPasteNotification() {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'paste-notification';
  
  // Add pulse animation to the clipboard icon
  notification.innerHTML = `
    <div class="notification-content">
      <span class="paste-icon">📋</span>
      <span>⌘ + V to paste</span>
    </div>
  `;
  
  // Add notification to the page
  document.body.appendChild(notification);
  
  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 1000);
  }, 5000);
}

// Function to create and show the popup
function showPopup() {
  // Create the popup container
  const popupContainer = document.createElement('div');
  popupContainer.className = 'chatgpt-redirect-popup';
  
  // Create the popup content
  popupContainer.innerHTML = `
    <div class="chatgpt-redirect-popup-content">
      <div class="popup-header">
        <div class="popup-logo">
          <span class="try-ai-text">TRY AI</span>
        </div>
      </div>
      <div class="ai-buttons-container">
        ${aiOptions.map(option => 
          `<button class="ai-button" data-ai="${option.name}" style="background: ${option.color}">
            <div class="ai-button-content">
              <span>${option.name}</span>
            </div>
          </button>`
        ).join('')}
      </div>
      <div class="chatgpt-redirect-buttons">
        <button id="chatgpt-redirect-no" class="chatgpt-btn secondary">No, stay on Google</button>
      </div>
    </div>
  `;
  
  // Add the popup to the page
  document.body.appendChild(popupContainer);
  
  // Add event listeners to AI buttons
  document.querySelectorAll('.ai-button').forEach(button => {
    button.addEventListener('click', function() {
      const selectedAI = this.getAttribute('data-ai');
      
      // Save user preference
      savePreferredAI(selectedAI);
      
      // Find the URL for the selected AI
      const aiOption = aiOptions.find(option => option.name === selectedAI);
      if (!aiOption) return;
      
      // Get the search query
      const searchQuery = getGoogleSearchQuery();
      
      // Copy search query to clipboard before opening the new tab
      if (searchQuery) {
        navigator.clipboard.writeText(searchQuery).then(() => {
          console.log('Search query copied to clipboard');
          
          // Store that we've copied something and should show paste notification
          chrome.storage.local.set({
            showPasteNotification: true,
            aiPlatform: selectedAI
          });
          
          // Open the selected AI in a new tab after successful copy
          window.open(aiOption.url, '_blank');
        }).catch(err => {
          console.error('Failed to copy search query: ', err);
          // Open the tab anyway even if copy fails
          window.open(aiOption.url, '_blank');
        });
      } else {
        // If no search query, just open the AI platform
        window.open(aiOption.url, '_blank');
      }
      
      // Close the popup
      removePopup();
    });
  });
  
  document.getElementById('chatgpt-redirect-no').addEventListener('click', function() {
    // Close the popup
    removePopup();
  });
}

// Function to remove the popup
function removePopup() {
  const popup = document.querySelector('.chatgpt-redirect-popup');
  if (popup) {
    popup.remove();
  }
}

// Function to check if we should show the paste notification
function checkForPasteNotification() {
  chrome.storage.local.get(['showPasteNotification', 'aiPlatform'], function(result) {
    if (result.showPasteNotification) {
      // Get current platform
      const currentPlatform = getCurrentAIPlatform();
      
      // Show notification if we're on the right platform
      if (currentPlatform === result.aiPlatform) {
        showPasteNotification();
        
        // Reset the flag so we don't show it again
        chrome.storage.local.set({showPasteNotification: false});
      }
    }
  });
}

// Function to determine which AI platform we're currently on
function getCurrentAIPlatform() {
  if (window.location.hostname.includes('chat.openai.com')) {
    return 'ChatGPT';
  } else if (window.location.hostname.includes('gemini.google.com')) {
    return 'Gemini';
  } else if (window.location.hostname.includes('claude.ai')) {
    return 'Claude';
  }
  return null;
}

// Wait for the page to be fully loaded
window.addEventListener('load', function() {
  // If we're on a Google search page, show the popup
  if (isGoogleSearchPage()) {
    // Add a small delay to ensure the page is rendered
    setTimeout(showPopup, 1000);
  } 
  // If we're on an AI platform page, check if we should show the paste notification
  else if (isAIPlatformPage()) {
    // Add a small delay to ensure the page is rendered
    setTimeout(checkForPasteNotification, 1000);
  }
});