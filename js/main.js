/**
 * Main application script for Data Experience Knowledge Center
 */

// Application state
let appData = null;
let activeView = 'overview';
let selectedSource = null;
let selectedPlatform = null;
let selectedPersona = null;
let selectedJourney = null;
let filterMode = null; // Add this line - can be 'persona', 'platform', etc.
let filterEntity = null; // Add this line - stores the ID of what we're filtering by

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
      
      // Ensure all required properties exist
      appData.sources = appData.sources || [];
      appData.platforms = appData.platforms || [];
      appData.personas = appData.personas || [];
      appData.journeys = appData.journeys || [];
      
      // Save the initial data to Firestore
      await saveAppData();
    }
    
    // Validate constants
    if (!appData.constants) {
      appData.constants = {
        sourceTypes: ["database", "dataWarehouse", "API", "fileSystem", "externalSystem"],
        dataAccessMethods: ["ODBC Connection", "REST API", "SFTP", "Direct Query", "Batch Export"],
        capabilityLevels: {
          "1": "Novice - Basic awareness only",
          "2": "Basic - Can use with guidance",
          "3": "Intermediate - Independent with common tasks",
          "4": "Advanced - Can perform complex operations",
          "5": "Expert - Can train others, deep expertise"
        },
        standardCapabilityTypes: ["dataVisualization", "dataAnalysis", "selfService", "dataSystems", "dataQuality"]
      };
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial content
       if (typeof renderContent === 'function') {
      renderContent();
    } else {
      console.error('renderContent function not found. Check if render.js is loaded properly.');
      // Display an error message
      mainContent.innerHTML = `
        <div class="card">
          <h2>Error Loading Application</h2>
          <p>Application resources failed to load properly. Please try refreshing the page.</p>
        </div>
      `;
    }
  }
}

/**
 * Set up event listeners for the application
 */
function setupEventListeners() {
  overviewBtn.addEventListener('click', () => {
  setActiveView('overview');
  // Clear filters when going to overview
  filterMode = null;
  filterEntity = null;
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
 * Helper function to select a persona
 * @param {string} id - Persona ID
 */
function selectPersona(id) {
  selectedPersona = id;
  
  // Enable filtering without changing the view
  filterMode = 'persona';
  filterEntity = id;
  
  // Don't change active view
  // setActiveView('personas'); <- Remove this line
  
  renderContent();
}

function selectPlatform(id, enableFiltering = false) {
  selectedPlatform = id;
  
  if (enableFiltering) {
    filterMode = 'platform';
    filterEntity = id;
  }
  
  setActiveView('platforms');
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

function clearFilters() {
  filterMode = null;
  filterEntity = null;
  renderContent();
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
  
