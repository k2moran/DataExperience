# Data Experience Knowledge Center

A web application for managing data analytics platforms, user personas, and user journeys for an Academic Medical Center Analytics Experience Strategy.

## Project Structure

```
data-experience/
├── index.html                  # Main HTML file
├── css/
│   └── styles.css              # Consolidated styles
├── js/
│   ├── main.js                 # Core application logic
│   ├── render.js               # UI rendering functions
│   ├── modals.js               # Modal handling functions
│   └── form-handlers.js        # Form management
└── data/
    └── app-data.json           # Application data in JSON format
```

## Features

- **Platform Management**: Track data platforms, their capabilities, and integrations
- **Persona Management**: Document user personas with their capabilities and pain points
- **Journey Mapping**: Map user journeys across different platforms
- **Cross-Referencing**: View relationships between platforms, personas, and journeys
- **Data Persistence**: Automatically saves changes to localStorage

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. The application loads with sample data initially
4. Use the navigation buttons to switch between overview and detailed views
5. Use the "+" buttons to add new items

## Development

The application is built with vanilla JavaScript and does not require any build steps or dependencies. The code is structured into separate modules for easier maintenance:

- **main.js**: Application initialization, state management, and event listeners
- **render.js**: All UI rendering functions
- **modals.js**: Modal dialog handling
- **form-handlers.js**: Form submission handlers and dynamic form management

## Data Structure

The application stores data in a structured JSON format with the following main sections:

- **platforms**: Data analytics platforms with their capabilities and integrations
- **personas**: User personas with their capabilities, pain points, and preferred platforms
- **journeys**: User journeys that map steps across different platforms
- **constants**: Configuration values like capability levels and standard capability types

## Browser Compatibility

The application is compatible with modern browsers (Chrome, Firefox, Safari, Edge) and is responsive for mobile devices.

## Future Enhancements

Potential areas for future development:

1. Server-side data storage
2. User authentication
3. Export/import functionality
4. Data visualization for capability assessments and journey maps
5. Search and filtering capabilities
6. Collaboration features