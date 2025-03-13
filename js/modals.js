/**
 * Modal handling functions for the Data Experience Knowledge Center
 */

/**
 * Open the modal dialog
 */
function openModal() {
  modalContainer.style.display = 'block';
}

/**
 * Close the modal dialog
 */
function closeModal() {
  modalContainer.style.display = 'none';
}

/**
 * Open the Add Source modal dialog
 */
function openAddSourceModal() {
  try {
    // Ensure appData and platforms exist
    if (!appData || !appData.platforms) {
      console.error('appData or platforms is undefined');
      alert('Error: Application data is not properly loaded. Please refresh the page.');
      return;
    }

    const platformOptions = appData.platforms.map(p => `
      <option value="${p.id}">${p.name}</option>
    `).join('');
    
    modalBody.innerHTML = `
      <h2>Add New Data Source</h2>
      <form id="addSourceForm">
        <div class="form-group">
          <label for="sourceId">ID (no spaces):</label>
          <input type="text" id="sourceId" required pattern="[a-zA-Z0-9]+" title="Only letters and numbers, no spaces">
        </div>
        
        <div class="form-group">
          <label for="sourceName">Name:</label>
          <input type="text" id="sourceName" required>
        </div>
        
        <div class="form-group">
          <label for="sourceDescription">Description:</label>
          <textarea id="sourceDescription" required></textarea>
        </div>
        
        <div class="form-group">
          <label for="sourceType">Source Type:</label>
          <select id="sourceType" required>
            ${(appData.constants?.sourceTypes || [
              "database", 
              "dataWarehouse", 
              "API", 
              "fileSystem", 
              "externalSystem"
            ]).map(type => `
              <option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>
            `).join('')}
          </select>
        </div>
        
        <div class="form-group">
          <label for="accessMethod">Access Method:</label>
          <select id="accessMethod" required>
            ${(appData.constants?.dataAccessMethods || [
              "ODBC Connection",
              "REST API",
              "SFTP",
              "Direct Query",
              "Batch Export"
            ]).map(method => `
              <option value="${method}">${method}</option>
            `).join('')}
          </select>
        </div>
        
        <div class="form-group">
          <label>Technologies:</label>
          <div id="technologiesContainer" class="dynamic-inputs">
            <div class="dynamic-input-row">
              <input type="text" name="technology" placeholder="Enter technology" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          </div>
          <button type="button" class="add-input-btn" onclick="addDynamicInput('technologiesContainer', 'technology', 'Enter technology')">+ Add Technology</button>
        </div>
        
        <div class="form-group">
          <label>Data Types:</label>
          <div id="dataTypesContainer" class="dynamic-inputs">
            <div class="dynamic-input-row">
              <input type="text" name="dataType" placeholder="Enter data type" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          </div>
          <button type="button" class="add-input-btn" onclick="addDynamicInput('dataTypesContainer', 'dataType', 'Enter data type')">+ Add Data Type</button>
        </div>
        
        <div class="form-group">
          <label>Associated Platforms:</label>
          <select id="platformsSelect" multiple style="height: 100px;">
            ${platformOptions}
          </select>
          <p style="font-size: 12px; color: #666; margin-top: 5px;">
            Hold Ctrl/Cmd to select multiple platforms
          </p>
        </div>
        
        <div class="form-group">
          <h3>Data Governance</h3>
          <div class="grid">
            <div>
              <label for="governanceOwner">Owner:</label>
              <input type="text" id="governanceOwner" required>
            </div>
            <div>
              <label for="sensitivityLevel">Sensitivity Level:</label>
              <select id="sensitivityLevel" required>
                <option value="Public">Public</option>
                <option value="Internal">Internal</option>
                <option value="Confidential">Confidential</option>
                <option value="PHI">PHI</option>
              </select>
            </div>
            <div>
              <label for="refreshFrequency">Refresh Frequency:</label>
              <select id="refreshFrequency" required>
                <option value="Real-time">Real-time</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
        
        <button type="submit" class="submit-btn">Add Source</button>
      </form>
    `;

    openModal();
    
    // Add event listeners to dynamic buttons
    setupDynamicInputs();
    
    // Form submission
    document.getElementById('addSourceForm').addEventListener('submit', handleAddSourceSubmit);
  } catch (error) {
    console.error('Error in openAddSourceModal:', error);
    alert('An error occurred while opening the Add Source modal. Please try again.');
  }
}


  
/**
 * Open the Add Platform modal dialog
 */
function openAddPlatformModal() {
  const platformIds = appData.platforms.map(p => p.id);
  
  modalBody.innerHTML = `
    <h2>Add New Platform</h2>
    <form id="addPlatformForm">
      <div class="form-group">
        <label for="platformId">ID (no spaces):</label>
        <input type="text" id="platformId" required pattern="[a-zA-Z0-9]+" title="Only letters and numbers, no spaces">
      </div>
      
      <div class="form-group">
        <label for="platformName">Name:</label>
        <input type="text" id="platformName" required>
      </div>
      
      <div class="form-group">
        <label for="platformDescription">Description:</label>
        <textarea id="platformDescription" required></textarea>
      </div>
      
      <div class="form-group">
        <label>Capabilities:</label>
        <div id="capabilitiesContainer" class="dynamic-inputs">
          <div class="dynamic-input-row">
            <input type="text" name="capability" placeholder="Enter capability" required>
            <button type="button" class="remove-btn">×</button>
          </div>
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('capabilitiesContainer', 'capability', 'Enter capability')">+ Add Capability</button>
      </div>
      
      <div class="form-group">
        <label>Integrations:</label>
        <div id="integrationsContainer" class="dynamic-inputs">
          <div class="dynamic-input-row">
            <input type="text" name="integration" placeholder="Enter platform ID" required>
            <button type="button" class="remove-btn">×</button>
          </div>
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('integrationsContainer', 'integration', 'Enter platform ID')">+ Add Integration</button>
        <p style="font-size: 12px; color: #666; margin-top: 5px;">
          Available platform IDs: ${platformIds.join(', ')}
        </p>
      </div>
      
      <button type="submit" class="submit-btn">Add Platform</button>
    </form>
  `;
  
  openModal();
  
  // Add event listeners to dynamic buttons
  setupDynamicInputs();
  
  // Form submission
  document.getElementById('addPlatformForm').addEventListener('submit', handleAddPlatformSubmit);
}

/**
 * Open the Add Persona modal dialog - UPDATED VERSION
 */
function openAddPersonaModal() {
  const platformOptions = appData.platforms.map(p => `
    <option value="${p.id}">${p.name}</option>
  `).join('');
  
  modalBody.innerHTML = `
    <h2>Add New Persona</h2>
    <form id="addPersonaForm">
      <div class="form-group">
        <label for="personaId">ID (no spaces):</label>
        <input type="text" id="personaId" required pattern="[a-zA-Z0-9]+" title="Only letters and numbers, no spaces">
      </div>
      
      <div class="form-group">
        <label for="personaName">Name:</label>
        <input type="text" id="personaName" required>
      </div>
      
      <div class="form-group">
        <label for="personaRole">Role:</label>
        <input type="text" id="personaRole" required>
      </div>
      
      <div class="form-group">
        <label>Key Responsibilities:</label>
        <div id="responsibilitiesContainer" class="dynamic-inputs">
          <div class="dynamic-input-row">
            <input type="text" name="responsibility" placeholder="Enter key responsibility" required>
            <button type="button" class="remove-btn">×</button>
          </div>
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('responsibilitiesContainer', 'responsibility', 'Enter key responsibility')">+ Add Responsibility</button>
      </div>
      
      <div class="form-group">
        <label>Business Goals:</label>
        <div id="businessGoalsContainer" class="dynamic-inputs">
          <div class="dynamic-input-row">
            <input type="text" name="businessGoal" placeholder="Enter business goal" required>
            <button type="button" class="remove-btn">×</button>
          </div>
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('businessGoalsContainer', 'businessGoal', 'Enter business goal')">+ Add Business Goal</button>
      </div>
      
      <div class="form-group">
        <label>Critical Decisions:</label>
        <div id="criticalDecisionsContainer" class="dynamic-inputs">
          <div class="dynamic-input-row">
            <input type="text" name="criticalDecision" placeholder="Enter critical decision" required>
            <button type="button" class="remove-btn">×</button>
          </div>
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('criticalDecisionsContainer', 'criticalDecision', 'Enter critical decision')">+ Add Critical Decision</button>
      </div>
      
      <div class="form-group">
        <label>Information Needs:</label>
        <div id="informationNeedsContainer" class="dynamic-inputs">
          <div class="dynamic-input-row">
            <input type="text" name="informationNeed" placeholder="Enter information need" required>
            <button type="button" class="remove-btn">×</button>
          </div>
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('informationNeedsContainer', 'informationNeed', 'Enter information need')">+ Add Information Need</button>
      </div>
      
      <div class="form-group">
        <label>Data Consumption Preferences:</label>
        <div id="dataConsumptionContainer" class="dynamic-inputs">
          <div class="dynamic-input-row">
            <input type="text" name="dataConsumption" placeholder="Enter data consumption preference" required>
            <button type="button" class="remove-btn">×</button>
          </div>
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('dataConsumptionContainer', 'dataConsumption', 'Enter data consumption preference')">+ Add Preference</button>
      </div>
      
      <div class="form-group">
        <label>Pain Points:</label>
        <div id="painPointsContainer" class="dynamic-inputs">
          <div class="dynamic-input-row">
            <input type="text" name="painPoint" placeholder="Enter pain point" required>
            <button type="button" class="remove-btn">×</button>
          </div>
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('painPointsContainer', 'painPoint', 'Enter pain point')">+ Add Pain Point</button>
      </div>
      
      <div class="form-group">
        <label>Primary Platforms:</label>
        <select id="platformsSelect" multiple style="height: 100px;">
          ${platformOptions}
        </select>
        <p style="font-size: 12px; color: #666; margin-top: 5px;">
          Hold Ctrl/Cmd to select multiple platforms
        </p>
      </div>
      
      <button type="submit" class="submit-btn">Add Persona</button>
    </form>
  `;
  
  openModal();
  
  // Add event listeners to dynamic buttons
  setupDynamicInputs();
  
  // Form submission
  document.getElementById('addPersonaForm').addEventListener('submit', handleAddPersonaSubmit);
}

/**
 * Open the Add Journey modal dialog
 */
function openAddJourneyModal() {
  const personaOptions = appData.personas.map(p => `
    <option value="${p.id}">${p.name}</option>
  `).join('');
  
  modalBody.innerHTML = `
    <h2>Add New Journey</h2>
    <form id="addJourneyForm">
      <div class="form-group">
        <label for="journeyId">ID (no spaces):</label>
        <input type="text" id="journeyId" required pattern="[a-zA-Z0-9]+" title="Only letters and numbers, no spaces">
      </div>
      
      <div class="form-group">
        <label for="journeyName">Name:</label>
        <input type="text" id="journeyName" required>
      </div>
      
      <div class="form-group">
        <label for="personaSelect">Primary Persona:</label>
        <select id="personaSelect" required>
          <option value="">-- Select Persona --</option>
          ${personaOptions}
        </select>
      </div>
      
      <div class="form-group">
        <label>Journey Steps:</label>
        <div id="stepsContainer">
          <div class="journey-step-input" data-index="0">
            <h4>Step 1</h4>
            
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
          </div>
        </div>
        
        <button type="button" class="add-input-btn" onclick="addJourneyStep()" style="margin-top: 15px;">+ Add Step</button>
      </div>
      
      <button type="submit" class="submit-btn">Add Journey</button>
    </form>
  `;
  
  openModal();
  
  // Add event listeners to dynamic buttons
  setupDynamicInputs();
  
  // Form submission
  document.getElementById('addJourneyForm').addEventListener('submit', handleAddJourneySubmit);
}

/**
 * Open the Edit Source modal dialog
 * @param {string} sourceId - ID of the source to edit
 */
function openEditSourceModal(sourceId) {
  const source = appData.sources.find(s => s.id === sourceId);
  if (!source) return;
  
  const platformOptions = appData.platforms.map(p => `
    <option value="${p.id}" ${source.associatedPlatforms.includes(p.id) ? 'selected' : ''}>${p.name}</option>
  `).join('');
  
  // First create the modal HTML with the form fields
  modalBody.innerHTML = `
    <h2>Edit Source: ${source.name}</h2>
    <form id="editSourceForm">
      <input type="hidden" id="originalSourceId" value="${source.id}">
      
      <div class="form-group">
        <label for="sourceId">ID (no spaces):</label>
        <input type="text" id="sourceId" value="${source.id}" required pattern="[a-zA-Z0-9]+" title="Only letters and numbers, no spaces">
      </div>
      
      <div class="form-group">
        <label for="sourceName">Name:</label>
        <input type="text" id="sourceName" value="${source.name}" required>
      </div>
      
      <div class="form-group">
        <label for="sourceDescription">Description:</label>
        <textarea id="sourceDescription" required>${source.description}</textarea>
      </div>
      
      <div class="form-group">
        <label for="sourceType">Source Type:</label>
        <select id="sourceType" required>
          ${(appData.constants?.sourceTypes || [
            "database", 
            "dataWarehouse", 
            "API", 
            "fileSystem", 
            "externalSystem"
          ]).map(type => `
            <option value="${type}" ${source.type === type ? 'selected' : ''}>${type.charAt(0).toUpperCase() + type.slice(1)}</option>
          `).join('')}
        </select>
      </div>
      
      <div class="form-group">
        <label for="accessMethod">Access Method:</label>
        <select id="accessMethod" required>
          ${(appData.constants?.dataAccessMethods || [
            "ODBC Connection",
            "REST API",
            "SFTP",
            "Direct Query",
            "Batch Export"
          ]).map(method => `
            <option value="${method}" ${source.accessMethod === method ? 'selected' : ''}>${method}</option>
          `).join('')}
        </select>
      </div>
      
      <div class="form-group">
        <label>Technologies:</label>
        <div id="technologiesContainer" class="dynamic-inputs">
          ${source.technologies.map(tech => `
            <div class="dynamic-input-row">
              <input type="text" name="technology" value="${tech}" placeholder="Enter technology" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
          ${source.technologies.length === 0 ? `
            <div class="dynamic-input-row">
              <input type="text" name="technology" placeholder="Enter technology" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          ` : ''}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('technologiesContainer', 'technology', 'Enter technology')">+ Add Technology</button>
      </div>
      
      <div class="form-group">
        <label>Data Types:</label>
        <div id="dataTypesContainer" class="dynamic-inputs">
          ${source.dataTypes.map(type => `
            <div class="dynamic-input-row">
              <input type="text" name="dataType" value="${type}" placeholder="Enter data type" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
          ${source.dataTypes.length === 0 ? `
            <div class="dynamic-input-row">
              <input type="text" name="dataType" placeholder="Enter data type" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          ` : ''}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('dataTypesContainer', 'dataType', 'Enter data type')">+ Add Data Type</button>
      </div>
      
      <div class="form-group">
        <label>Associated Platforms:</label>
        <select id="platformsSelect" multiple style="height: 100px;">
          ${platformOptions}
        </select>
        <p style="font-size: 12px; color: #666; margin-top: 5px;">
          Hold Ctrl/Cmd to select multiple platforms
        </p>
      </div>
      
      <div class="form-group">
        <h3>Data Governance</h3>
        <div class="grid">
          <div>
            <label for="governanceOwner">Owner:</label>
            <input type="text" id="governanceOwner" value="${source.dataGovernance.owner}" required>
          </div>
          <div>
            <label for="sensitivityLevel">Sensitivity Level:</label>
            <select id="sensitivityLevel" required>
              <option value="Public" ${source.dataGovernance.sensitivityLevel === 'Public' ? 'selected' : ''}>Public</option>
              <option value="Internal" ${source.dataGovernance.sensitivityLevel === 'Internal' ? 'selected' : ''}>Internal</option>
              <option value="Confidential" ${source.dataGovernance.sensitivityLevel === 'Confidential' ? 'selected' : ''}>Confidential</option>
              <option value="PHI" ${source.dataGovernance.sensitivityLevel === 'PHI' ? 'selected' : ''}>PHI</option>
            </select>
          </div>
          <div>
            <label for="refreshFrequency">Refresh Frequency:</label>
            <select id="refreshFrequency" required>
              <option value="Real-time" ${source.dataGovernance.refreshFrequency === 'Real-time' ? 'selected' : ''}>Real-time</option>
              <option value="Hourly" ${source.dataGovernance.refreshFrequency === 'Hourly' ? 'selected' : ''}>Hourly</option>
              <option value="Daily" ${source.dataGovernance.refreshFrequency === 'Daily' ? 'selected' : ''}>Daily</option>
              <option value="Weekly" ${source.dataGovernance.refreshFrequency === 'Weekly' ? 'selected' : ''}>Weekly</option>
              <option value="Monthly" ${source.dataGovernance.refreshFrequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
            </select>
          </div>
        </div>
      </div>
      
      <button type="submit" class="submit-btn">Update Source</button>
    </form>
  `;
  
  openModal();
  
  // Setup dynamic input remove buttons
  setupDynamicInputs();
  
  // Form submission - attach event listener to the form
  document.getElementById('editSourceForm').addEventListener('submit', handleEditSourceSubmit);
}




/**
 * Open the Edit Platform modal dialog
 * @param {string} platformId - ID of the platform to edit
 */
function openEditPlatformModal(platformId) {
  const platform = appData.platforms.find(p => p.id === platformId);
  if (!platform) return;
  
  const platformIds = appData.platforms.map(p => p.id);
  
  modalBody.innerHTML = `
    <h2>Edit Platform: ${platform.name}</h2>
    <form id="editPlatformForm">
      <input type="hidden" id="originalPlatformId" value="${platform.id}">
      
      <div class="form-group">
        <label for="platformId">ID (no spaces):</label>
        <input type="text" id="platformId" value="${platform.id}" required pattern="[a-zA-Z0-9]+" title="Only letters and numbers, no spaces">
      </div>
      
      <div class="form-group">
        <label for="platformName">Name:</label>
        <input type="text" id="platformName" value="${platform.name}" required>
      </div>
      
      <div class="form-group">
        <label for="platformDescription">Description:</label>
        <textarea id="platformDescription" required>${platform.description}</textarea>
      </div>
      
      <div class="form-group">
        <label>Capabilities:</label>
        <div id="capabilitiesContainer" class="dynamic-inputs">
          ${platform.capabilities.map(capability => `
            <div class="dynamic-input-row">
              <input type="text" name="capability" value="${capability}" placeholder="Enter capability" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('capabilitiesContainer', 'capability', 'Enter capability')">+ Add Capability</button>
      </div>
      
      <div class="form-group">
        <label>Integrations:</label>
        <div id="integrationsContainer" class="dynamic-inputs">
          ${platform.integrations.map(integration => `
            <div class="dynamic-input-row">
              <input type="text" name="integration" value="${integration}" placeholder="Enter platform ID" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('integrationsContainer', 'integration', 'Enter platform ID')">+ Add Integration</button>
        <p style="font-size: 12px; color: #666; margin-top: 5px;">
          Available platform IDs: ${platformIds.join(', ')}
        </p>
      </div>
      
      <button type="submit" class="submit-btn">Update Platform</button>
    </form>
  `;
  
  openModal();
  
  // Add event listeners to dynamic buttons
  setupDynamicInputs();
  
  // Form submission
  document.getElementById('editPlatformForm').addEventListener('submit', handleEditPlatformSubmit);
}

/**
 * Open the Edit Persona modal dialog - UPDATED VERSION
 * @param {string} personaId - ID of the persona to edit
 */
function openEditPersonaModal(personaId) {
  const persona = appData.personas.find(p => p.id === personaId);
  if (!persona) return;
  
  const platformOptions = appData.platforms.map(p => `
    <option value="${p.id}" ${persona.primaryPlatforms.includes(p.id) ? 'selected' : ''}>${p.name}</option>
  `).join('');
  
  modalBody.innerHTML = `
    <h2>Edit Persona: ${persona.name}</h2>
    <form id="editPersonaForm">
      <input type="hidden" id="originalPersonaId" value="${persona.id}">
      
      <div class="form-group">
        <label for="personaId">ID (no spaces):</label>
        <input type="text" id="personaId" value="${persona.id}" required pattern="[a-zA-Z0-9]+" title="Only letters and numbers, no spaces">
      </div>
      
      <div class="form-group">
        <label for="personaName">Name:</label>
        <input type="text" id="personaName" value="${persona.name}" required>
      </div>
      
      <div class="form-group">
        <label for="personaRole">Role:</label>
        <input type="text" id="personaRole" value="${persona.role}" required>
      </div>
      
      <div class="form-group">
        <label>Key Responsibilities:</label>
        <div id="responsibilitiesContainer" class="dynamic-inputs">
          ${(persona.responsibilities || []).map(item => `
            <div class="dynamic-input-row">
              <input type="text" name="responsibility" value="${item}" placeholder="Enter key responsibility" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
          ${(persona.responsibilities || []).length === 0 ? `
            <div class="dynamic-input-row">
              <input type="text" name="responsibility" placeholder="Enter key responsibility" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          ` : ''}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('responsibilitiesContainer', 'responsibility', 'Enter key responsibility')">+ Add Responsibility</button>
      </div>
      
      <div class="form-group">
        <label>Business Goals:</label>
        <div id="businessGoalsContainer" class="dynamic-inputs">
          ${(persona.businessGoals || []).map(item => `
            <div class="dynamic-input-row">
              <input type="text" name="businessGoal" value="${item}" placeholder="Enter business goal" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
          ${(persona.businessGoals || []).length === 0 ? `
            <div class="dynamic-input-row">
              <input type="text" name="businessGoal" placeholder="Enter business goal" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          ` : ''}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('businessGoalsContainer', 'businessGoal', 'Enter business goal')">+ Add Business Goal</button>
      </div>
      
      <div class="form-group">
        <label>Critical Decisions:</label>
        <div id="criticalDecisionsContainer" class="dynamic-inputs">
          ${(persona.criticalDecisions || []).map(item => `
            <div class="dynamic-input-row">
              <input type="text" name="criticalDecision" value="${item}" placeholder="Enter critical decision" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
          ${(persona.criticalDecisions || []).length === 0 ? `
            <div class="dynamic-input-row">
              <input type="text" name="criticalDecision" placeholder="Enter critical decision" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          ` : ''}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('criticalDecisionsContainer', 'criticalDecision', 'Enter critical decision')">+ Add Critical Decision</button>
      </div>
      
      <div class="form-group">
        <label>Information Needs:</label>
        <div id="informationNeedsContainer" class="dynamic-inputs">
          ${(persona.informationNeeds || []).map(item => `
            <div class="dynamic-input-row">
              <input type="text" name="informationNeed" value="${item}" placeholder="Enter information need" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
          ${(persona.informationNeeds || []).length === 0 ? `
            <div class="dynamic-input-row">
              <input type="text" name="informationNeed" placeholder="Enter information need" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          ` : ''}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('informationNeedsContainer', 'informationNeed', 'Enter information need')">+ Add Information Need</button>
      </div>
      
      <div class="form-group">
        <label>Data Consumption Preferences:</label>
        <div id="dataConsumptionContainer" class="dynamic-inputs">
          ${(persona.dataConsumptionPreferences || []).map(item => `
            <div class="dynamic-input-row">
              <input type="text" name="dataConsumption" value="${item}" placeholder="Enter data consumption preference" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
          ${(persona.dataConsumptionPreferences || []).length === 0 ? `
            <div class="dynamic-input-row">
              <input type="text" name="dataConsumption" placeholder="Enter data consumption preference" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          ` : ''}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('dataConsumptionContainer', 'dataConsumption', 'Enter data consumption preference')">+ Add Preference</button>
      </div>
      
      <div class="form-group">
        <label>Pain Points:</label>
        <div id="painPointsContainer" class="dynamic-inputs">
          ${persona.painPoints.map(point => `
            <div class="dynamic-input-row">
              <input type="text" name="painPoint" value="${point}" placeholder="Enter pain point" required>
              <button type="button" class="remove-btn">×</button>
            </div>
          `).join('')}
        </div>
        <button type="button" class="add-input-btn" onclick="addDynamicInput('painPointsContainer', 'painPoint', 'Enter pain point')">+ Add Pain Point</button>
      </div>
      
      <div class="form-group">
        <label>Primary Platforms:</label>
        <select id="platformsSelect" multiple style="height: 100px;">
          ${platformOptions}
        </select>
        <p style="font-size: 12px; color: #666; margin-top: 5px;">
          Hold Ctrl/Cmd to select multiple platforms
        </p>
      </div>
      
      <button type="submit" class="submit-btn">Update Persona</button>
    </form>
  `;
  
  openModal();
  
  // Add event listeners to dynamic buttons
  setupDynamicInputs();
  
  // Form submission
  document.getElementById('editPersonaForm').addEventListener('submit', handleEditPersonaSubmit);
}

/**
 * Open the Edit Journey modal dialog
 * @param {string} journeyId - ID of the journey to edit
 */
function openEditJourneyModal(journeyId) {
  const journey = appData.journeys.find(j => j.id === journeyId);
  if (!journey) return;
  
  const personaOptions = appData.personas.map(p => `
    <option value="${p.id}" ${journey.persona === p.id ? 'selected' : ''}>${p.name}</option>
  `).join('');
  
  modalBody.innerHTML = `
    <h2>Edit Journey: ${journey.name}</h2>
    <form id="editJourneyForm">
      <input type="hidden" id="originalJourneyId" value="${journey.id}">
      
      <div class="form-group">
        <label for="journeyId">ID (no spaces):</label>
        <input type="text" id="journeyId" value="${journey.id}" required pattern="[a-zA-Z0-9]+" title="Only letters and numbers, no spaces">
      </div>
      
      <div class="form-group">
        <label for="journeyName">Name:</label>
        <input type="text" id="journeyName" value="${journey.name}" required>
      </div>
      
      <div class="form-group">
        <label for="personaSelect">Primary Persona:</label>
        <select id="personaSelect" required>
          <option value="">-- Select Persona --</option>
          ${personaOptions}
        </select>
      </div>
      
      <div class="form-group">
        <label>Journey Steps:</label>
        <div id="stepsContainer">
          ${journey.steps.map((step, idx) => `
            <div class="journey-step-input" data-index="${idx}">
              <h4>Step ${idx + 1}</h4>
              
              <div class="form-group">
                <label>Platform (optional):</label>
                <select class="platform-select">
                  <option value="">-- No Platform --</option>
                  ${appData.platforms.map(p => `
                    <option value="${p.id}" ${step.platform === p.id ? 'selected' : ''}>${p.name}</option>
                  `).join('')}
                </select>
              </div>
              
              <div class="form-group">
                <label>Action:</label>
                <input type="text" class="step-action" value="${step.action}" required>
              </div>
              
              <div class="form-group">
                <label>Pain Points:</label>
                <div class="pain-points-container dynamic-inputs">
                  ${(step.painPoints || []).map(point => `
                    <div class="dynamic-input-row">
                      <input type="text" name="stepPainPoint" value="${point}" placeholder="Enter pain point">
                      <button type="button" class="remove-btn">×</button>
                    </div>
                  `).join('')}
                  ${(step.painPoints || []).length === 0 ? `
                    <div class="dynamic-input-row">
                      <input type="text" name="stepPainPoint" placeholder="Enter pain point">
                      <button type="button" class="remove-btn">×</button>
                    </div>
                  ` : ''}
                </div>
                <button type="button" class="add-input-btn" onclick="addStepPainPoint(this)">+ Add Pain Point</button>
              </div>
            </div>
          `).join('')}
        </div>
        
        <button type="button" class="add-input-btn" onclick="addJourneyStep()" style="margin-top: 15px;">+ Add Step</button>
      </div>
      
      <button type="submit" class="submit-btn">Update Journey</button>
    </form>
  `;
  
  openModal();
  
  // Add event listeners to dynamic buttons
  setupDynamicInputs();
  
  // Form submission
  document.getElementById('editJourneyForm').addEventListener('submit', handleEditJourneySubmit);
}

/**
 * Open the delete confirmation modal
 * @param {string} entityType - Type of entity being deleted (persona, journey, platform, source)
 * @param {string} entityId - ID of the entity to delete
 * @param {string} entityName - Name of the entity to display in the confirmation
 */
function openDeleteModal(entityType, entityId, entityName) {
  const deleteModalContainer = document.getElementById('deleteModalContainer');
  const deleteConfirmText = document.getElementById('deleteConfirmText');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  
  // Set the confirmation text
  deleteConfirmText.textContent = `Are you sure you want to delete ${entityType} "${entityName}"?`;
  
  // Set up the delete button click handler
  confirmDeleteBtn.onclick = function() {
    handleDelete(entityType, entityId);
    closeDeleteModal();
  };
  
  // Display the modal
  deleteModalContainer.style.display = 'block';
}

/**
 * Close the delete confirmation modal
 */
function closeDeleteModal() {
  const deleteModalContainer = document.getElementById('deleteModalContainer');
  deleteModalContainer.style.display = 'none';
}


