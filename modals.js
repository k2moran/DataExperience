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
 * Open the Add Persona modal dialog
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
        <label>Capabilities:</label>
        ${appData.constants.standardCapabilityTypes.map(capability => `
          <div style="margin-bottom: 15px;">
            <label>${capability.replace(/([A-Z])/g, ' $1').trim()}:</label>
            <div class="slider-container">
              <input type="range" class="range-slider" name="${capability}" min="1" max="5" value="3">
              <span class="slider-value">3</span>
              <span class="slider-description">${appData.constants.capabilityLevels[3]}</span>
            </div>
          </div>
        `).join('')}
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
  
  // Add event listeners to range sliders
  document.querySelectorAll('.range-slider').forEach(slider => {
    const valueSpan = slider.parentNode.querySelector('.slider-value');
    const descriptionSpan = slider.parentNode.querySelector('.slider-description');
    
    slider.addEventListener('input', function() {
      valueSpan.textContent = this.value;
      descriptionSpan.textContent = appData.constants.capabilityLevels[this.value];
    });
  });
  
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
 * Open the Edit Persona modal dialog
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
        <label>Capabilities:</label>
        ${appData.constants.standardCapabilityTypes.map(capability => {
          const level = persona.capabilities[capability] || 3;
          return `
            <div style="margin-bottom: 15px;">
              <label>${capability.replace(/([A-Z])/g, ' $1').trim()}:</label>
              <div class="slider-container">
                <input type="range" class="range-slider" name="${capability}" min="1" max="5" value="${level}">
                <span class="slider-value">${level}</span>
                <span class="slider-description">${appData.constants.capabilityLevels[level]}</span>
              </div>
            </div>
          `;
        }).join('')}
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
  
  // Add event listeners to range sliders
  document.querySelectorAll('.range-slider').forEach(slider => {
    const valueSpan = slider.parentNode.querySelector('.slider-value');
    const descriptionSpan = slider.parentNode.querySelector('.slider-description');
    
    slider.addEventListener('input', function() {
      valueSpan.textContent = this.value;
      descriptionSpan.textContent = appData.constants.capabilityLevels[this.value];
    });
  });
  
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