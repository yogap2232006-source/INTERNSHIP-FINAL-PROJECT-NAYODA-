# Nayoda Frontend

A lightweight, vanilla JavaScript frontend for the Nayoda project management platform. No build tools, no frameworks—just clean HTML, CSS, and JavaScript.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## Technology

- **Language**: Vanilla JavaScript (ES6 modules)
- **Styling**: CSS3 (no Tailwind, no preprocessors)
- **Routing**: Client-side routing (no external library)
- **HTTP**: Fetch API (axios available if needed)
- **State**: LocalStorage for authentication
- **Real-time**: Socket.io client ready

## Project Structure

See [VANILLA_JS_SETUP.md](./VANILLA_JS_SETUP.md) for detailed documentation on:
- Project structure
- Routing system
- Authentication flow
- API integration
- Page components
- Development tips

## Pages

- **Login** - User authentication
- **Register** - New user registration  
- **Dashboard** - Overview and statistics
- **Profile** - User profile management
- **Projects** - Project listing and creation
- **Project Details** - Project info and proposals
- **Chat** - Messaging interface
- **Admin Dashboard** - Admin controls (admin role only)

## Development

No build step required! All changes reflect immediately when you refresh.

```bash
npm run dev         # Start server
npm run preview     # Preview production
npm run build       # No-op (vanilla JS ready to deploy)
```

## Features

✨ No dependencies on React, Vue, or Angular  
⚡ Lightning-fast load times  
🎨 Responsive CSS design  
🔐 Token-based authentication  
🛡️ Protected routes and role-based access  
📱 Mobile-friendly interface  
🔌 Real-time ready with Socket.io  

## API Configuration

Update the API base URL in `src/utils/auth.js`:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

## Deployment

Copy the entire `frontend` folder to any web server. No build step needed!

## License

MIT
