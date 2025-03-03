/**
 * Main application script for Data Experience Knowledge Center
 */

// Application state
let appData = null;
let activeView = 'overview';
let selectedSource = null;  // New state for sources
let selectedPlatform = null;
let selectedPersona = null;
let selectedJourney = null;

// DOM elements
const mainContent = document.getElementById('mainContent');
const overviewBtn = document.getElementById('overviewBtn');
const sourcesBtn = document.getElementById('sourcesBtn');  // New button
const platformsBtn = document.getElementById('platformsBtn');
const personasBtn = document.getElementById('personasBtn');
const journeysBtn = document.getElementById('journeysBtn');
const modalContainer = document.getElementById('modalContainer');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.querySelector('.close-modal');

/**
 * Initialize the application
 */
async function initializeApp() {
  try {
    mainContent.innerHTML = `
      <div class="loading">
        <p>Loading application data...</p>
      </div>
    `;
    
    // First try loading from Firestore
    let firestoreData = await loadAppData();
    
    if (firestoreData) {
      // Use the saved data if available
      console.log('Loaded data from Firestore');
      appData = firestoreData;
    } else {
      // If no saved data, fetch from JSON file
      console.log('No saved data found, loading from JSON file');
      const response = await fetch('data/app-data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      appData = await response.json();
      
      // Ensure sources exists
      if (!appData.sources) {
        appData.sources = [];
      }
      
      // Save the initial data to Firestore
      await saveAppData();
    }

    // Additional validation
    console.log('Loaded appData:', appData);
    
    // Ensure sources array exists before rendering
    if (!Array.isArray(appData.sources)) {
      appData.sources = [];
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial content
    renderContent();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    mainContent.innerHTML = `
      <div class="card">
        <h2>Error Loading Application</h2>
        <p>There was a problem loading the application data. Please try refreshing the page.</p>
        <p>Error details: ${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}

/**
 * Set up event listeners for the application
 */
function setupEventListeners() {
  overviewBtn.addEventListener('click', () => {
    setActiveView('overview');
    renderContent();
  });

    // Navigation buttons
  sourcesBtn.addEventListener('click', () => {
    setActiveView('sources');
    renderContent();
  });
    
  platformsBtn.addEventListener('click', () => {
    setActiveView('platforms');
    renderContent();
  });

  personasBtn.addEventListener('click', () => {
    setActiveView('personas');
    renderContent();
  });

  journeysBtn.addEventListener('click', () => {
    setActiveView('journeys');
    renderContent();
  });

  // Modal event listeners
  closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
      closeModal();
    }
  });
}

/**
 * Helper function to set active view
 * @param {string} view - The view to activate
 */
function setActiveView(view) {
  activeView = view;
  
  // Update button states
  [overviewBtn, sourcesBtn, platformsBtn, personasBtn, journeysBtn].forEach(btn => {
    btn.classList.remove('active');
  });
  
  switch(view) {
    case 'overview':
      overviewBtn.classList.add('active');
      break;
    case 'sources':
      sourcesBtn.classList.add('active');
      break;
    case 'platforms':
      platformsBtn.classList.add('active');
      break;
    case 'personas':
      personasBtn.classList.add('active');
      break;
    case 'journeys':
      journeysBtn.classList.add('active');
      break;
  }
}

/**
 * Helper function to select a source
 * @param {string} id - Source ID
 */
function selectSource(id) {
  selectedSource = id;
  setActiveView('sources');
  renderContent();
}

/**
 * Helper function to select a platform
 * @param {string} id - Platform ID
 */
function selectPlatform(id) {
  selectedPlatform = id;
  setActiveView('platforms');
  renderContent();
}

/**
 * Helper function to select a persona
 * @param {string} id - Persona ID
 */
function selectPersona(id) {
  selectedPersona = id;
  setActiveView('personas');
  renderContent();
}

/**
 * Helper function to select a journey
 * @param {string} id - Journey ID
 */
function selectJourney(id) {
  selectedJourney = id;
  setActiveView('journeys');
  renderContent();
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
