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
let viewMode = 'default'; // new state for tracking view mode: 'default', 'filtered', or 'edit'
let filterPersona = null; // new state to track which persona is being used as a filter

// DOM elements
const mainContent = document.getElementById('mainContent');
const overviewBtn = document.getElementById('overviewBtn');
const sourcesBtn = document.getElementById('sourcesBtn');
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
    clearFilters(); // Clear any active filters when going to overview
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
  viewMode = 'default'; // Reset view mode when changing views

  // Reset selection variables when changing views
  if (view !== 'platforms') selectedPlatform = null;
  if (view !== 'sources') selectedSource = null;
  if (view !== 'personas') selectedPersona = null;
  if (view !== 'journeys') selectedJourney = null;
  
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
 * Filter the overview by a specific persona
 * @param {string} personaId - ID of the persona to filter by
 */
function filterByPersona(personaId) {
  filterPersona = personaId;
  // Don't call setActiveView since it resets viewMode
  viewMode = 'filtered';
  renderContent();
}

/**
 * Clear any active filters and return to default view
 */
function clearFilters() {
  viewMode = 'default';
  filterPersona = null;
  renderContent();
}

/**
 * Switch to edit mode for the current filtered persona
 */
function switchToEditMode() {
  viewMode = 'edit';
  if (filterPersona) {
    selectedPersona = filterPersona;
    setActiveView('personas');
  }
  renderContent();
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
