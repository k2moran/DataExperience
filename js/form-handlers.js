/**
 * Form handling functions for the Data Experience Knowledge Center
 */

/**
 * Save application data to Firestore
 */
async function saveAppData() {
  try {
    await db.collection("appData").doc("mainData").set(appData);
    console.log('Data saved successfully to Firestore');
  } catch (error) {
    console.error('Failed to save data to Firestore:', error);
    alert('There was a problem saving your changes. Please try again or check console for errors.');
  }
}

/**
 * Load application data from Firestore
 * @returns {Promise<Object|null>} The loaded app data or null if not found
 */
async function loadAppData() {
  try {
    const doc = await db.collection("appData").doc("mainData").get();
    
    if (doc.exists) {
      console.log('Successfully loaded data from Firestore');
      const data = doc.data();
      
      // Log the exact structure of the retrieved data
      console.log('Retrieved Firestore data:', JSON.stringify(data, null, 2));
      
      // Ensure all required arrays exist
      if (!data.sources) data.sources = [];
      if (!data.platforms) data.platforms = [];
      if (!data.personas) data.personas = [];
      if (!data.journeys) data.journeys = [];
      if (!data.constants) data.constants = {};
      
      return data;
    } else {
      console.log('No data found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('Failed to load data from Firestore:', error);
    return null;
  }
}

async function saveAppData() {
  try {
    // Ensure all required properties exist
    const dataToSave = {
      sources: appData.sources || [],
      platforms: appData.platforms || [],
      personas: appData.personas || [],
      journeys: appData.journeys || [],
      constants: appData.constants || {}
    };

    await db.collection("appData").doc("mainData").set(dataToSave);
    console.log('Data saved successfully to Firestore');
  } catch (error) {
    console.error('Failed to save data to Firestore:', error);
    alert('There was a problem saving your changes. Please try again or check console for errors.');
  }
}


/**
 * Helper for adding dynamic inputs (capabilities, pain points, etc.)
 * @param {string} containerId - ID of the container element
 * @param {string} inputName - Name attribute for the input
 * @param {string} placeholder - Placeholder text for the input
 */
function addDynamicInput(containerId, inputName, placeholder) {
  const container = document.getElementById(containerId);
  const newRow = document.createElement('div');
  newRow.className = 'dynamic-input-row';
  
  newRow.innerHTML = `
    <input type="text" name="${inputName}" placeholder="${placeholder}" required>
    <button type="button" class="remove-btn">×</button>
  `;
  
  container.appendChild(newRow);
  
  // Add event listener to the new remove button
  newRow.querySelector('.remove-btn').addEventListener('click', function() {
    container.removeChild(newRow);
  });
}

/**
 * Setup dynamic input remove buttons
 */
function setupDynamicInputs() {
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.parentNode;
      const container = row.parentNode;
      container.removeChild(row);
    });
  });
}

/**
 * Handle Add Source form submission
 * @param {Event} e - Form submit event
 */
function handleAddSourceSubmit(e) {
  e.preventDefault();
  
  // Get form values
  const id = document.getElementById('sourceId').value.trim();
  const name = document.getElementById('sourceName').value.trim();
  const description = document.getElementById('sourceDescription').value.trim();
  const sourceType = document.getElementById('sourceType').value.trim();
  const accessMethod = document.getElementById('accessMethod').value.trim();
  
  // Get technologies
  const technologies = [];
  document.querySelectorAll('#technologiesContainer input[name="technology"]').forEach(input => {
    const value = input.value.trim();
    if (value) technologies.push(value);
  });
  
  // Get data types
  const dataTypes = [];
  document.querySelectorAll('#dataTypesContainer input[name="dataType"]').forEach(input => {
    const value = input.value.trim();
    if (value) dataTypes.push(value);
  });
  
  // Get associated platforms
  const platformsSelect = document.getElementById('platformsSelect');
  const associatedPlatforms = Array.from(platformsSelect.selectedOptions).map(option => option.value);
  
  // Get governance details
  const owner = document.getElementById('governanceOwner').value.trim();
  const sensitivityLevel = document.getElementById('sensitivityLevel').value.trim();
  const refreshFrequency = document.getElementById('refreshFrequency').value.trim();
  
  // Validate ID uniqueness
  if (appData.sources.some(s => s.id === id)) {
    alert('Source ID already exists. Please choose a unique ID.');
    return;
  }
  
  // Create new source
  const newSource = {
    id,
    name,
    description,
    type: sourceType,
    technologies,
    dataTypes,
    associatedPlatforms,
    accessMethod,
    primaryUsers: [], // can be populated later
    dataGovernance: {
      owner,
      sensitivityLevel,
      refreshFrequency
    }
  };
  
  // Add to data
  appData.sources.push(newSource);
  
  // Save the data
  saveAppData();
  
  // Close modal and refresh view
  closeModal();
  setActiveView('sources');
  selectedSource = id;
  renderContent();
}

/**
 * Add journey step to form
 */
function addJourneyStep() {
  const container = document.getElementById('stepsContainer');
  const stepCount = container.querySelectorAll('.journey-step-input').length + 1;
  
  const newStep = document.createElement('div');
  newStep.className = 'journey-step-input';
  newStep.dataset.index = stepCount - 1;
  
  newStep.innerHTML = `
    <h4>Step ${stepCount}</h4>
    
    <div class="form-group">
      <label>Platform (optional):</label>
      <select class="platform-select">
        <option value="">-- No Platform --</option>
        ${appData.platforms.map(p => `
          <option value="${p.id}">${p.name}</option>
        `).join('')}
      </select>
    </div>
    
    <div class="form-group">
      <label>Action:</label>
      <input type="text" class="step-action" required>
    </div>
    
    <div class="form-group">
      <label>Pain Points:</label>
      <div class="pain-points-container dynamic-inputs">
        <div class="dynamic-input-row">
          <input type="text" name="stepPainPoint" placeholder="Enter pain point">
          <button type="button" class="remove-btn">×</button>
        </div>
      </div>
      <button type="button" class="add-input-btn" onclick="addStepPainPoint(this)">+ Add Pain Point</button>
    </div>
  `;
  
  container.appendChild(newStep);
  
  // Setup dynamic input remove buttons
  setupDynamicInputs();
}

/**
 * Add pain point to journey step
 * @param {HTMLElement} btn - Button element that was clicked
 */
function addStepPainPoint(btn) {
  const container = btn.previousElementSibling;
  const newRow = document.createElement('div');
  newRow.className = 'dynamic-input-row';
  
  newRow.innerHTML = `
    <input type="text" name="stepPainPoint" placeholder="Enter pain point">
    <button type="button" class="remove-btn">×</button>
  `;
  
  container.appendChild(newRow);
  
  // Add event listener to the new remove button
  newRow.querySelector('.remove-btn').addEventListener('click', function() {
    container.removeChild(newRow);
  });
}

/**
 * Handle Add Platform form submission
 * @param {Event} e - Form submit event
 */
function handleAddPlatformSubmit(e) {
  e.preventDefault();
  
  // Get form values
  const id = document.getElementById('platformId').value.trim();
  const name = document.getElementById('platformName').value.trim();
  const description = document.getElementById('platformDescription').value.trim();
  
  // Get capabilities
  const capabilities = [];
  document.querySelectorAll('#capabilitiesContainer input[name="capability"]').forEach(input => {
    const value = input.value.trim();
    if (value) capabilities.push(value);
  });
  
  // Get integrations
  const integrations = [];
  document.querySelectorAll('#integrationsContainer input[name="integration"]').forEach(input => {
    const value = input.value.trim();
    if (value) integrations.push(value);
  });
  
  // Validate ID uniqueness
  if (appData.platforms.some(p => p.id === id)) {
    alert('Platform ID already exists. Please choose a unique ID.');
    return;
  }
  
  // Create new platform
  const newPlatform = {
    id,
    name,
    description,
    capabilities,
    integrations,
    primaryUsers: [] // Empty initially, will be populated when personas select it
  };
  
  // Add to data
  appData.platforms.push(newPlatform);
  
  // Save the data
  saveAppData();
  
  // Close modal and refresh view
  closeModal();
  setActiveView('platforms');
  selectedPlatform = id;
  renderContent();
}

/**
 * Handle Add Persona form submission
 * @param {Event} e - Form submit event
 */
function handleAddPersonaSubmit(e) {
  e.preventDefault();
  
  // Get form values
  const id = document.getElementById('personaId').value.trim();
  const name = document.getElementById('personaName').value.trim();
  const role = document.getElementById('personaRole').value.trim();
  
  // Get capabilities
  const capabilities = {};
  appData.constants.standardCapabilityTypes.forEach(capability => {
    const slider = document.querySelector(`input[name="${capability}"]`);
    capabilities[capability] = parseInt(slider.value);
  });
  
  // Get pain points
  const painPoints = [];
  document.querySelectorAll('#painPointsContainer input[name="painPoint"]').forEach(input => {
    const value = input.value.trim();
    if (value) painPoints.push(value);
  });
  
  // Get primary platforms
  const platformsSelect = document.getElementById('platformsSelect');
  const primaryPlatforms = Array.from(platformsSelect.selectedOptions).map(option => option.value);
  
  // Validate ID uniqueness
  if (appData.personas.some(p => p.id === id)) {
    alert('Persona ID already exists. Please choose a unique ID.');
    return;
  }
  
  // Create new persona
  const newPersona = {
    id,
    name,
    role,
    capabilities,
    painPoints,
    primaryPlatforms
  };
  
  // Add to data
  appData.personas.push(newPersona);
  
  // Save the data
  saveAppData();
  
  // Close modal and refresh view
  closeModal();
  setActiveView('personas');
  selectedPersona = id;
  renderContent();
}

/**
 * Handle Add Journey form submission
 * @param {Event} e - Form submit event
 */
function handleAddJourneySubmit(e) {
  e.preventDefault();
  
  // Get form values
  const id = document.getElementById('journeyId').value.trim();
  const name = document.getElementById('journeyName').value.trim();
  const persona = document.getElementById('personaSelect').value;
  
  // Get steps
  const steps = [];
  document.querySelectorAll('.journey-step-input').forEach(stepEl => {
    const platform = stepEl.querySelector('.platform-select').value || null;
    const action = stepEl.querySelector('.step-action').value.trim();
    
    // Get pain points
    const painPoints = [];
    stepEl.querySelectorAll('input[name="stepPainPoint"]').forEach(input => {
      const value = input.value.trim();
      if (value) painPoints.push(value);
    });
    
    const step = {
      action
    };
    
    if (platform) step.platform = platform;
    if (painPoints.length > 0) step.painPoints = painPoints;
    
    steps.push(step);
  });
  
  // Validate ID uniqueness
  if (appData.journeys.some(j => j.id === id)) {
    alert('Journey ID already exists. Please choose a unique ID.');
    return;
  }
  
  // Create new journey
  const newJourney = {
    id,
    name,
    persona,
    steps
  };
  
  // Add to data
  appData.journeys.push(newJourney);
  
  // Save the data
  saveAppData();
  
  // Close modal and refresh view
  closeModal();
  setActiveView('journeys');
  selectedJourney = id;
  renderContent();
}

/**
 * Handle Edit Source form submission
 * @param {Event} e - Form submit event
 */
function handleEditSourceSubmit(e) {
  e.preventDefault();
  
  const originalId = document.getElementById('originalSourceId').value;
  const id = document.getElementById('sourceId').value.trim();
  const name = document.getElementById('sourceName').value.trim();
  const description = document.getElementById('sourceDescription').value.trim();
  const sourceType = document.getElementById('sourceType').value.trim();
  const accessMethod = document.getElementById('accessMethod').value.trim();
  
  // Get technologies
  const technologies = [];
  document.querySelectorAll('#technologiesContainer input[name="technology"]').forEach(input => {
    const value = input.value.trim();
    if (value) technologies.push(value);
  });
  
  // Get data types
  const dataTypes = [];
  document.querySelectorAll('#dataTypesContainer input[name="dataType"]').forEach(input => {
    const value = input.value.trim();
    if (value) dataTypes.push(value);
  });
  
  // Get associated platforms
  const platformsSelect = document.getElementById('platformsSelect');
  const associatedPlatforms = Array.from(platformsSelect.selectedOptions).map(option => option.value);
  
  // Get governance details
  const owner = document.getElementById('governanceOwner').value.trim();
  const sensitivityLevel = document.getElementById('sensitivityLevel').value.trim();
  const refreshFrequency = document.getElementById('refreshFrequency').value.trim();
  
  // Validate ID uniqueness if changed
  if (id !== originalId && appData.sources.some(s => s.id === id)) {
    alert('Source ID already exists. Please choose a unique ID.');
    return;
  }
  
  // Find the source to update
  const sourceIndex = appData.sources.findIndex(s => s.id === originalId);
  if (sourceIndex === -1) return;
  
  // Update source data
  appData.sources[sourceIndex] = {
    ...appData.sources[sourceIndex],
    id,
    name,
    description,
    type: sourceType,
    technologies,
    dataTypes,
    associatedPlatforms,
    accessMethod,
    dataGovernance: {
      owner,
      sensitivityLevel,
      refreshFrequency
    }
  };
  
  // Save the data
  saveAppData();
  
  // Close modal and refresh view
  closeModal();
  selectedSource = id;
  renderContent();
}

/**
 * Handle Edit Persona form submission
 * @param {Event} e - Form submit event
 */
function handleEditPersonaSubmit(e) {
  e.preventDefault();
  
  const originalId = document.getElementById('originalPersonaId').value;
  const id = document.getElementById('personaId').value.trim();
  const name = document.getElementById('personaName').value.trim();
  const role = document.getElementById('personaRole').value.trim();
  
  // Get capabilities
  const capabilities = {};
  appData.constants.standardCapabilityTypes.forEach(capability => {
    const slider = document.querySelector(`input[name="${capability}"]`);
    capabilities[capability] = parseInt(slider.value);
  });
  
  // Get pain points
  const painPoints = [];
  document.querySelectorAll('#painPointsContainer input[name="painPoint"]').forEach(input => {
    const value = input.value.trim();
    if (value) painPoints.push(value);
  });
  
  // Get primary platforms
  const platformsSelect = document.getElementById('platformsSelect');
  const primaryPlatforms = Array.from(platformsSelect.selectedOptions).map(option => option.value);
  
  // Validate ID uniqueness if changed
  if (id !== originalId && appData.personas.some(p => p.id === id)) {
    alert('Persona ID already exists. Please choose a unique ID.');
    return;
  }
  
  // Find the persona to update
  const personaIndex = appData.personas.findIndex(p => p.id === originalId);
  if (personaIndex === -1) return;
  
  // Keep track of the original ID for reference updates
  const oldId = appData.personas[personaIndex].id;
  
  // Update persona data
  appData.personas[personaIndex] = {
    ...appData.personas[personaIndex],
    id,
    name,
    role,
    capabilities,
    painPoints,
    primaryPlatforms
  };
  
  // Update references if ID changed
  if (id !== oldId) {
    // Update persona references in journeys
    appData.journeys.forEach(j => {
      if (j.persona === oldId) {
        j.persona = id;
      }
    });
  }
  
  // Save the data
  saveAppData();
  
  // Close modal and refresh view
  closeModal();
  selectedPersona = id;
  renderContent();
}

/**
 * Handle Edit Journey form submission
 * @param {Event} e - Form submit event
 */
function handleEditJourneySubmit(e) {
  e.preventDefault();
  
  const originalId = document.getElementById('originalJourneyId').value;
  const id = document.getElementById('journeyId').value.trim();
  const name = document.getElementById('journeyName').value.trim();
  const persona = document.getElementById('personaSelect').value;
  
  // Get steps
  const steps = [];
  document.querySelectorAll('.journey-step-input').forEach(stepEl => {
    const platform = stepEl.querySelector('.platform-select').value || null;
    const action = stepEl.querySelector('.step-action').value.trim();
    
    // Get pain points
    const painPoints = [];
    stepEl.querySelectorAll('input[name="stepPainPoint"]').forEach(input => {
      const value = input.value.trim();
      if (value) painPoints.push(value);
    });
    
    const step = {
      action
    };
    
    if (platform) step.platform = platform;
    if (painPoints.length > 0) step.painPoints = painPoints;
    
    steps.push(step);
  });
  
  // Validate ID uniqueness if changed
  if (id !== originalId && appData.journeys.some(j => j.id === id)) {
    alert('Journey ID already exists. Please choose a unique ID.');
    return;
  }
  
  // Find the journey to update
  const journeyIndex = appData.journeys.findIndex(j => j.id === originalId);
  if (journeyIndex === -1) return;
  
  // Update journey data
  appData.journeys[journeyIndex] = {
    ...appData.journeys[journeyIndex],
    id,
    name,
    persona,
    steps
  };
  
  // Save the data
  saveAppData();
  
  // Close modal and refresh view
  closeModal();
  selectedJourney = id;
  renderContent();
}
