# YC Pitch Simulator

A web application that simulates Y Combinator investor meetings, helping founders practice their startup pitches and prepare for real funding conversations.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

To verify your installation, run:
```bash
node --version
npm --version
```

### Installation

1. **Clone the repository** (if you haven't already):
```bash
git clone https://github.com/jaidenha/data-res-change-lab.git
cd data-res-change-lab
```

2. **Install dependencies**:
```bash
npm install
```

This will install Express and other required packages.

### Running the Application

#### Development Mode (with auto-reload)
Start the server with automatic restart on file changes:
```bash
npm run dev
```

#### Production Mode
Start the server normally:
```bash
npm start
```

The application will be available at **`http://localhost:3000`**

#### Stopping the Server
Press `Ctrl + C` in the terminal where the server is running.

### Viewing Changes

- **Server changes** (`server.js`): When running in dev mode, the server auto-restarts
- **Frontend changes** (HTML/CSS/JS): Refresh your browser with `Cmd + Shift + R` (macOS) or `Ctrl + Shift + R` (Windows/Linux) to clear cache

## Project Structure

```
.
├── server.js             # Main Express server and API routes
├── html/                 # HTML pages
│   ├── index.html        # Landing page
│   └── simulation.html   # Simulation page (chatbot interface)
├── src/
│   └── public/           # Static files served to browser
│       ├── css/
│       │   └── style.css # Styles for all pages
│       ├── js/
│       │   └── main.js   # Client-side JavaScript
│       └── images/       # Image assets
├── package.json          # Project dependencies and scripts
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Features

- **Landing Page**: Overview of the YC Pitch Simulator with call-to-action
- **Simulation Page**: Interactive chatbot interface for pitch practice (coming soon)
- **API Endpoints**: Backend routes for handling simulation logic

## Available Routes

- `/` - Landing page
- `/simulation` - Pitch simulation interface
- `/api/data` - Example API endpoint (GET/POST)

## Development Workflow

1. Make changes to files
2. Server auto-restarts (if using `npm run dev`)
3. Hard refresh browser to see frontend changes
4. Check terminal for any errors

## Troubleshooting

**Page not updating?**
- Ensure you're running `npm run dev` for auto-reload
- Do a hard refresh: `Cmd + Shift + R` (macOS) or `Ctrl + Shift + R` (Windows/Linux)
- Check that files are in the correct directories

**Server won't start?**
- Check if port 3000 is already in use
- Verify all dependencies are installed with `npm install`
- Look for error messages in the terminal

## License

ISC
