/**
 * Rendering functions for the Data Experience Knowledge Center
 */

/**
 * Main render function to determine what to display
 */
function renderContent() {
  switch(activeView) {
    case 'overview':
      renderOverview();
      break;
    case 'sources':
      renderSourceDetail();
      break;
    case 'platforms':
      renderPlatformDetail();
      break;
    case 'personas':
      renderPersonaDetail();
      break;
    case 'journeys':
      renderJourneyDetail();
      break;
  }
}

/**
 * Render the overview page with all sections
 */
function renderOverview() {
  // Ensure sources exists and is an array
  const sources = Array.isArray(appData.sources) ? appData.sources : [];

  // Apply filters to each section if needed
  let personasToShow = appData.personas;
  let journeysToShow = appData.journeys;
  let platformsToShow = appData.platforms;
  let sourcesToShow = sources;
  
  if (filterMode === 'persona') {
    // Filter to show only the selected persona
    personasToShow = personasToShow.filter(p => p.id === filterEntity);
    
    // Filter journeys for the selected persona
    journeysToShow = journeysToShow.filter(j => j.persona === filterEntity);
    
    // Filter platforms used by the selected persona
    const persona = appData.personas.find(p => p.id === filterEntity);
    if (persona && persona.primaryPlatforms) {
      platformsToShow = platformsToShow.filter(p => 
        persona.primaryPlatforms.includes(p.id)
      );
      
      // Filter sources associated with the persona's platforms
      sourcesToShow = sourcesToShow.filter(source => 
        source.associatedPlatforms.some(platformId => 
          persona.primaryPlatforms.includes(platformId)
        )
      );
    }
  }

  // Display filter banner if filtering is active
  const filterBanner = document.getElementById('filterBanner');
  if (filterMode === 'persona') {
    const persona = appData.personas.find(p => p.id === filterEntity);
    if (persona) {
      filterBanner.innerHTML = `
        <div>Filtering by Persona: <strong>${persona.name}</strong></div>
        <button onclick="clearFilters()">Clear Filter</button>
      `;
      filterBanner.style.display = 'flex';
    }
  } else {
    filterBanner.style.display = 'none';
  }

  let html = `
    <div class="grid">
      <div class="card">
        <div class="section-header">
          <h2>User Personas</h2>
          <button class="add-new-btn" onclick="openAddPersonaModal()">+ Add Persona</button>
        </div>
        <div class="persona-list">
          ${personasToShow.map(persona => `
            <div class="item" onclick="selectPersona('${persona.id}')">
              <div class="item-title">${persona.name}</div>
              <div class="item-subtitle">${persona.role}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="card">
        <div class="section-header">
          <h2>User Journeys</h2>
          <button class="add-new-btn" onclick="openAddJourneyModal()">+ Add Journey</button>
        </div>
        <div class="journey-list">
          ${journeysToShow.map(journey => {
            const persona = appData.personas.find(p => p.id === journey.persona);
            return `
              <div class="item" onclick="selectJourney('${journey.id}')">
                <div class="item-title">${journey.name}</div>
                <div class="item-subtitle">${persona ? persona.name : 'Unknown persona'}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="section-header">
          <h2>Platforms</h2>
          <button class="add-new-btn" onclick="openAddPlatformModal()">+ Add Platform</button>
        </div>
        <div class="platform-list">
          ${platformsToShow.map(platform => `
            <div class="item" onclick="selectPlatform('${platform.id}')">
              <div class="item-title">${platform.name}</div>
              <div class="item-subtitle">${platform.description}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="section-header">
          <h2>Data Sources</h2>
          <button class="add-new-btn" onclick="openAddSourceModal()">+ Add Source</button>
        </div>
        <div class="source-list">
          ${sourcesToShow.map(source => `
            <div class="item" onclick="selectSource('${source.id}')">
              <div class="item-title">${source.name}</div>
              <div class="item-subtitle">${source.type}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  mainContent.innerHTML = html;
}

/**
 * Render platform detail view
 */
function renderPlatformDetail() {
  if (!selectedPlatform) {
    let platformsToShow = appData.platforms;
    
    // Apply persona filtering if active
    if (filterMode === 'persona' && filterEntity) {
      const persona = appData.personas.find(p => p.id === filterEntity);
      if (persona && persona.primaryPlatforms) {
        platformsToShow = platformsToShow.filter(platform => 
          persona.primaryPlatforms.includes(platform.id)
        );
      }
    }
    
    mainContent.innerHTML = `
      <div class="card">
        <div class="section-header">
          <h2>Platforms</h2>
          <button class="add-new-btn" onclick="openAddPlatformModal()">+ Add Platform</button>
        </div>
        <p>Select a platform to view details</p>
        <div class="platform-list">
          ${platformsToShow.map(platform => `
            <div class="item" onclick="selectPlatform('${platform.id}')">
              <div class="item-title">${platform.name}</div>
              <div class="item-subtitle">${platform.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }
  
  const platform = appData.platforms.find(p => p.id === selectedPlatform);
  if (!platform) {
    mainContent.innerHTML = '<p>Platform not found</p>';
    return;
  }
  
  const usedByPersonas = appData.personas.filter(p => 
    p.primaryPlatforms.includes(platform.id)
  );
  
  const journeysUsingPlatform = appData.journeys.filter(j => 
    j.steps.some(s => s.platform === platform.id)
  );
  
  let html = `
    <div class="card">
      <div class="section-header">
        <h2>${platform.name}</h2>
        <button class="add-new-btn" onclick="openEditPlatformModal('${platform.id}')">Edit Platform</button>
        <button class="delete-btn" onclick="openDeleteModal('platform', '${platform.id}', '${platform.name}')">Delete Platform</button>
      </div>
      <p>${platform.description}</p>
      
      <h3>Capabilities</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
        ${platform.capabilities.map(cap => `
          <span class="tag tag-blue">${cap}</span>
        `).join('')}
      </div>
      
      <h3>Integrates With</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
        ${platform.integrations.map(int => {
          const intPlatform = appData.platforms.find(p => p.id === int);
          return `
            <span class="tag tag-purple" onclick="selectPlatform('${int}')" style="cursor: pointer;">
              ${intPlatform ? intPlatform.name : int}
            </span>
          `;
        }).join('')}
      </div>
      
      <h3>Used By</h3>
      <div class="grid" style="margin-bottom: 15px; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
        ${usedByPersonas.map(persona => `
          <div class="item" onclick="selectPersona('${persona.id}')">
            <div class="item-title">${persona.name}</div>
            <div class="item-subtitle">${persona.role}</div>
          </div>
        `).join('')}
      </div>
      
      <h3>User Journeys</h3>
      <div>
        ${journeysUsingPlatform.map(journey => `
          <div class="item" onclick="selectJourney('${journey.id}')">
            <div class="item-title">${journey.name}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  mainContent.innerHTML = html;
}

/**
 * Render persona detail view
 */
function renderPersonaDetail() {
  if (!selectedPersona) {
    let personasToShow = appData.personas;
    
    mainContent.innerHTML = `
      <div class="card">
        <div class="section-header">
          <h2>User Personas</h2>
          <button class="add-new-btn" onclick="openAddPersonaModal()">+ Add Persona</button>
          <button class="delete-btn" onclick="openDeleteModal('persona', '${persona.id}', '${persona.name}')">Delete Persona</button>
        </div>
        <p>Select a persona to view details</p>
        <div class="persona-list">
          ${personasToShow.map(persona => `
            <div class="item" onclick="selectPersona('${persona.id}')">
              <div class="item-title">${persona.name}</div>
              <div class="item-subtitle">${persona.role}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }
  
  const persona = appData.personas.find(p => p.id === selectedPersona);
  if (!persona) {
    mainContent.innerHTML = '<p>Persona not found</p>';
    return;
  }
  
  const usedPlatforms = appData.platforms.filter(p => 
    persona.primaryPlatforms.includes(p.id)
  );
  
  const personaJourneys = appData.journeys.filter(j => 
    j.persona === persona.id
  );
  
  let html = `
    <div class="card">
      <div class="section-header">
        <h2>${persona.name}</h2>
        <button class="add-new-btn" onclick="openEditPersonaModal('${persona.id}')">Edit Persona</button>
      </div>
      <p style="color: #666; margin-bottom: 20px;">${persona.role}</p>
      
      <div class="persona-columns">
        <!-- Column 1 -->
        <div class="persona-column">
          <h3>Key Responsibilities</h3>
          <ul class="persona-list">
            ${(persona.responsibilities || []).map(item => `<li>${item}</li>`).join('')}
          </ul>
          
          <h3>Business Goals</h3>
          <ul class="persona-list">
            ${(persona.businessGoals || []).map(item => `<li>${item}</li>`).join('')}
          </ul>
          
          <h3>Critical Decisions</h3>
          <ul class="persona-list">
            ${(persona.criticalDecisions || []).map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        
        <!-- Column 2 -->
        <div class="persona-column">
          <h3>Information Needs</h3>
          <ul class="persona-list">
            ${(persona.informationNeeds || []).map(item => `<li>${item}</li>`).join('')}
          </ul>
          
          <h3>Data Consumption Preferences</h3>
          <ul class="persona-list">
            ${(persona.dataConsumptionPreferences || []).map(item => `<li>${item}</li>`).join('')}
          </ul>
          
          <h3>Pain Points</h3>
          <ul class="pain-point-list">
            ${persona.painPoints.map(point => `<li>${point}</li>`).join('')}
          </ul>
        </div>
        
        <!-- Empty third column -->
        <div class="empty-column"></div>
      </div>
      
      <h3>Primary Platforms</h3>
      <div class="grid" style="margin-bottom: 20px; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
        ${usedPlatforms.map(platform => `
          <div class="item" onclick="selectPlatform('${platform.id}')">
            <div class="item-title">${platform.name}</div>
            <div class="item-subtitle">${platform.description}</div>
          </div>
        `).join('')}
      </div>
      
      <h3>User Journeys</h3>
      ${personaJourneys.length > 0 ? `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${personaJourneys.map(journey => `
            <div class="item" onclick="selectJourney('${journey.id}')">
              <div class="item-title">${journey.name}</div>
            </div>
          `).join('')}
        </div>
      ` : `
        <p style="color: #666; font-style: italic;">No journeys mapped yet</p>
      `}
    </div>
  `;
  
  mainContent.innerHTML = html;
}

/**
 * Render journey detail view
 */
function renderJourneyDetail() {
  if (!selectedJourney) {
    let journeysToShow = appData.journeys;
    
    // Apply persona filtering if active
    if (filterMode === 'persona' && filterEntity) {
      journeysToShow = journeysToShow.filter(journey => journey.persona === filterEntity);
    }
    
    mainContent.innerHTML = `
      <div class="card">
        <div class="section-header">
          <h2>User Journeys</h2>
          <button class="add-new-btn" onclick="openAddJourneyModal()">+ Add Journey</button>
          <button class="delete-btn" onclick="openDeleteModal('journey', '${journey.id}', '${journey.name}')">Delete Journey</button>
        </div>
        <p>Select a journey to view details</p>
        <div class="journey-list">
          ${journeysToShow.map(journey => {
            const persona = appData.personas.find(p => p.id === journey.persona);
            return `
              <div class="item" onclick="selectJourney('${journey.id}')">
                <div class="item-title">${journey.name}</div>
                <div class="item-subtitle">${persona ? persona.name : 'Unknown persona'}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    return;
  }
  
  const journey = appData.journeys.find(j => j.id === selectedJourney);
  if (!journey) {
    mainContent.innerHTML = '<p>Journey not found</p>';
    return;
  }
  
  const persona = appData.personas.find(p => p.id === journey.persona);
  
  let html = `
    <div class="card">
      <div class="section-header">
        <h2>${journey.name}</h2>
        <button class="add-new-btn" onclick="openEditJourneyModal('${journey.id}')">Edit Journey</button>
      </div>
      
      ${persona ? `
        <div style="margin-bottom: 20px;">
          <span>Primary Persona: </span>
          <a href="#" onclick="selectPersona('${persona.id}'); return false;" style="color: #2563eb; text-decoration: none;">
            ${persona.name}
          </a>
        </div>
      ` : ''}
      
      <h3>Journey Steps</h3>
      <div style="margin-top: 15px;">
        ${journey.steps.map((step, idx) => {
          const platform = step.platform ? 
            appData.platforms.find(p => p.id === step.platform) : null;
          
          return `
            <div class="journey-step">
              <div class="step-header">
                <span class="tag tag-blue">Step ${idx + 1}</span>
                ${platform ? `
                  <span class="tag tag-purple" onclick="selectPlatform('${platform.id}')" style="cursor: pointer;">
                    ${platform.name}
                  </span>
                ` : ''}
              </div>
              <p style="font-weight: 500; margin-bottom: 5px;">${step.action}</p>
              ${step.painPoints && step.painPoints.length > 0 ? `
                <div class="step-pain-points">
                  <span class="step-pain-points-title">Pain Points:</span>
                  <ul class="step-pain-points-list">
                    ${step.painPoints.map(point => `<li>${point}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  mainContent.innerHTML = html;
}

/**
 * Render source detail view
 */
function renderSourceDetail() {
  if (!selectedSource) {
    let sourcesToShow = appData.sources;
    
    // Apply persona filtering if active
    if (filterMode === 'persona' && filterEntity) {
      const persona = appData.personas.find(p => p.id === filterEntity);
      if (persona && persona.primaryPlatforms) {
        // Show sources associated with the persona's primary platforms
        sourcesToShow = sourcesToShow.filter(source => 
          source.associatedPlatforms.some(platformId => 
            persona.primaryPlatforms.includes(platformId)
          )
        );
      }
    }
    
    mainContent.innerHTML = `
      <div class="card">
        <div class="section-header">
          <h2>Data Sources</h2>
          <button class="add-new-btn" onclick="openAddSourceModal()">+ Add Source</button>
          <button class="delete-btn" onclick="openDeleteModal('source', '${source.id}', '${source.name}')">Delete Source</button>
        </div>
        <p>Select a source to view details</p>
        <div class="source-list">
          ${sourcesToShow.map(source => `
            <div class="item" onclick="selectSource('${source.id}')">
              <div class="item-title">${source.name}</div>
              <div class="item-subtitle">${source.type}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }
  
  const source = appData.sources.find(s => s.id === selectedSource);
  if (!source) {
    mainContent.innerHTML = '<p>Source not found</p>';
    return;
  }
  
  const associatedPlatforms = appData.platforms.filter(p => 
    source.associatedPlatforms.includes(p.id)
  );
  
  let html = `
    <div class="card">
      <div class="section-header">
        <h2>${source.name}</h2>
        <button class="add-new-btn" onclick="openEditSourceModal('${source.id}')">Edit Source</button>
      </div>
      
      <p>${source.description}</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div>
          <h3>Source Details</h3>
          <div>
            <p><strong>Type:</strong> <span class="tag tag-blue">${source.type}</span></p>
            <p><strong>Access Method:</strong> <span>${source.accessMethod}</span></p>
          </div>
        </div>
        
        <div>
          <h3>Technologies</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${source.technologies.map(tech => `
              <span class="tag tag-purple">${tech}</span>
            `).join('')}
          </div>
        </div>
      </div>
      
      <h3>Data Characteristics</h3>
      <div style="display: flex; gap: 15px; margin-bottom: 20px;">
        <div>
          <strong>Data Types:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${source.dataTypes.map(type => `
              <span class="tag tag-green">${type}</span>
            `).join('')}
          </div>
        </div>
      </div>
      
      <h3>Data Governance</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div>
          <strong>Owner:</strong> ${source.dataGovernance.owner}
        </div>
        <div>
          <strong>Sensitivity Level:</strong> 
          <span class="tag tag-red">${source.dataGovernance.sensitivityLevel}</span>
        </div>
        <div>
          <strong>Refresh Frequency:</strong> 
          ${source.dataGovernance.refreshFrequency}
        </div>
      </div>
      
      <h3>Associated Platforms</h3>
      <div class="grid" style="margin-top: 15px; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
        ${associatedPlatforms.map(platform => `
          <div class="item" onclick="selectPlatform('${platform.id}')">
            <div class="item-title">${platform.name}</div>
            <div class="item-subtitle">${platform.description}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  mainContent.innerHTML = html;
}
