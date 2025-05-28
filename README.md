# P&ID Designer

A user-friendly drag-and-drop web application for designing 2D piping and instrumentation diagrams (P&ID) with Progressive Web App (PWA) support for offline use.

## Features

- Intuitive drag-and-drop interface for creating P&ID diagrams
- Extensive library of P&ID elements (pipes, valves, pumps, instruments, heat exchangers, etc.)
- Connect elements with smart pipes with distinct vertical and horizontal connections
- Save and load diagrams with local storage
- Export diagrams as PNG or SVG
- Progressive Web App (PWA) for offline use
- Grid snapping for precise element placement
- Edge/connection selection and management
- Element opacity control for better focus
- Comprehensive instructions panel

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- NPM or Yarn

### Installation

1. Clone this repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and visit the URL shown in your terminal (typically http://localhost:5173)
```

## How to Use

1. **Browse Elements**: The left sidebar contains a categorized list of P&ID elements
2. **Add Elements**: Drag elements from the sidebar onto the canvas
3. **Connect Elements**: Click and drag from one connection point (handle) to another
   - Red handles: Horizontal connections
   - Green handles: Vertical connections
4. **Arrange Elements**: Click and drag elements to position them on the canvas
5. **Grid Controls**: Adjust grid settings using the bottom-left panel
   - Toggle grid visibility
   - Enable/disable snapping
   - Adjust grid size
6. **Manage Connections**: 
   - Click on a connection to select it (turns red)
   - Press Delete key or use the "Delete Selected" button to remove it
7. **Save/Load**: 
   - Click "Save" to store your diagram with a custom name
   - Click "Load" to retrieve saved diagrams
   - Export as PNG or SVG for external use
8. **Offline Use**: Install the application as a PWA for offline access
   - The app will notify you when you're working offline
   - Changes are saved locally

## Technologies Used

- React & TypeScript
- React Flow for diagram rendering
- React DnD for drag and drop
- html-to-image for diagram export
- Vite & PWA plugin for offline capabilities
- Styled Components for styling
- React Flow (for diagram canvas)
- React DnD (for drag and drop)
- Styled Components (for styling)

## License

MIT
  },
})
```
