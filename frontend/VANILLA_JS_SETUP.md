# Nayoda Frontend - Vanilla HTML, CSS & JavaScript

This is a modern vanilla JavaScript frontend that replaces the previous Vite + React + Tailwind setup.

## Project Structure

```
frontend/
├── index.html                 # Main HTML entry point
├── package.json              # Dependencies (axios, socket.io-client)
├── public/                   # Static assets
├── src/
│   ├── main.js              # App initialization
│   ├── router.js            # Client-side routing system
│   ├── pages/               # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Profile.js
│   │   ├── Projects.js
│   │   ├── ProjectDetails.js
│   │   ├── Chat.js
│   │   └── AdminDashboard.js
│   ├── styles/
│   │   └── main.css         # Complete CSS styling (no Tailwind)
│   ├── utils/
│   │   ├── auth.js          # Authentication utilities
│   │   └── api.js           # API client functions
│   └── assets/              # Images, icons, etc.
```

## Getting Started

### Prerequisites
- Node.js (for dependencies)
- Python 3 (for development server) or any HTTP server

### Installation

```bash
cd frontend
npm install
```

### Development

Run the development server on port 5173:

```bash
npm run dev
```

Or use Python's built-in server:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173` in your browser.

### Build

No build step is needed - all files are vanilla JavaScript. Just copy the `frontend` folder to your web server.

```bash
npm run build
```

## Architecture

### Routing
- Client-side routing handled by `router.js`
- No external routing library needed
- Supports protected routes and role-based access control
- Dynamic route parameters (e.g., `/projects/:id`)

### State Management
- Authentication stored in `localStorage`
- User data kept in `localStorage` for persistence
- Token included in all API requests via `Authorization` header

### API Integration
- Uses native `fetch()` API instead of Axios (can still use axios from node_modules if needed)
- Centralized API client in `utils/api.js`
- Automatic 401 redirect to login on unauthorized access

### Styling
- No build tools needed for CSS
- Complete CSS reset and utility classes in `main.css`
- Responsive design with mobile-first approach
- Color scheme and spacing inspired by Tailwind but written in vanilla CSS

## Pages

### Public Pages
- **Login** - User authentication
- **Register** - New user registration

### Protected Pages (require authentication)
- **Dashboard** - Overview statistics and recent activity
- **Profile** - User profile management
- **Projects** - List and create projects
- **ProjectDetails** - View project details and proposals
- **Chat** - Messaging (placeholder)

### Admin Pages
- **AdminDashboard** - Admin statistics and controls (admin role required)

## API Integration

Update the `API_BASE` constant in `src/utils/auth.js` and `src/utils/api.js` to match your backend URL:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

## Features

✅ Vanilla JavaScript (no frameworks)
✅ No build process required
✅ Lightweight and fast
✅ Modern CSS with responsive design
✅ Client-side routing
✅ Token-based authentication
✅ Protected routes
✅ Role-based access control
✅ Socket.io ready for real-time features
✅ Clean, maintainable code structure

## Authentication Flow

1. User enters credentials on Login/Register page
2. `auth.js` sends request to backend
3. Token and user data stored in `localStorage`
4. Token included in all subsequent API requests
5. Protected routes check authentication before rendering
6. Admin routes check user role
7. Logout clears localStorage and redirects to login

## Development Tips

- Add new pages by creating a file in `src/pages/`
- Export a `render{PageName}(appDiv, params)` function
- Register route in `router.js`
- Use `navigateTo()` for client-side navigation
- Use `apiCall()` for backend requests

## Browser Compatibility

Works on all modern browsers that support:
- ES6 modules
- Fetch API
- LocalStorage
- CSS Grid/Flexbox

## Performance

- No build step = instant reload during development
- No framework overhead
- Minimal JavaScript bundle size
- Direct CSS (no PostCSS needed)
- Fast page loads with dynamic rendering

## Next Steps

1. Update `API_BASE` URLs to your backend
2. Customize colors and styling in `src/styles/main.css`
3. Run `npm install` to ensure dependencies are installed
4. Start development server with `npm run dev`
5. Begin building features!
