# 🌍 LOCATE.IO - IP Geolocation Dashboard

A modern, full-stack IP geolocation web application built with React and Vite. Search and visualize IP address locations worldwide with an interactive map interface, search history management, and sleek terminal-inspired UI.

![Version](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646cff)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [API Integration](#-api-integration)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### 🔐 Authentication
- Secure JWT-based authentication
- Auto-redirect for authenticated users
- Token stored in localStorage
- Protected routes with `PrivateRoute` component

### 🗺️ IP Geolocation
- **Auto-detection**: Automatically detects and displays your current IP location on load
- **IP Search**: Search any IPv4 address with real-time validation
- **Detailed Information**: View comprehensive geolocation data including:
  - IP address and organization
  - City, region, country
  - Postal code and timezone
  - Hostname
  - GPS coordinates (latitude/longitude)

### 🗺️ Interactive Map
- **Leaflet Integration**: Smooth, interactive map powered by OpenStreetMap
- **Custom Animated Markers**: Unique pulsing pin animation for IP locations
- **Fly-to Animation**: Smooth animated transitions when viewing different locations
- **Responsive Controls**: Zoom controls and map attribution

### 📝 Search History
- **Persistent Storage**: All searches automatically saved to database
- **History Panel**: View all previously searched IP addresses
- **Quick Access**: Click any history item to instantly reload its location
- **Bulk Delete**: Select multiple history items and delete them at once
- **Selection UI**: Checkbox interface with visual feedback

### 🎨 Modern UI/UX
- **Terminal-Inspired Design**: Sleek, technical aesthetic with monospace fonts
- **Dark Theme**: Eye-friendly dark color scheme with cyan accents
- **Responsive Layout**: Three-panel dashboard optimized for desktop use
- **Live Status Indicators**: Real-time signal status and uptime displays
- **Error Handling**: Clear error messages for invalid inputs and API failures

---

## 🛠️ Tech Stack

### Core
- **[React](https://react.dev/)** (v19.2.0) - UI library
- **[Vite](https://vite.dev/)** (v7.3.1) - Build tool and dev server
- **[React Router](https://reactrouter.com/)** (v7.13.1) - Client-side routing

### Mapping & Geolocation
- **[Leaflet](https://leafletjs.com/)** (v1.9.4) - Interactive maps
- **[React-Leaflet](https://react-leaflet.js.org/)** (v5.0.0) - React bindings for Leaflet
- **[ipinfo.io API](https://ipinfo.io/)** - IP geolocation data provider

### HTTP & Auth
- **[Axios](https://axios-http.com/)** (v1.13.5) - HTTP client
- **[jwt-decode](https://github.com/auth0/jwt-decode)** (v4.0.0) - JWT token decoding

### Code Quality
- **[ESLint](https://eslint.org/)** (v10.0.2) - Linting
- **ESLint React Plugins** - React-specific linting rules

### Styling
- **CSS Modules** - Scoped component styling
- **Custom CSS** - Terminal-inspired theme with animations

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (for cloning the repository)

### Backend API Required
This frontend requires a backend API server with the following endpoints:
- `POST /auth/login` - User authentication
- `GET /history` - Fetch search history
- `POST /history` - Save search history
- `DELETE /history` - Delete history items

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/itzjmbruhhh/geo-webapp.git
cd geo-webapp/frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root of the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**Important**: Replace `http://localhost:5000/api` with your actual backend API URL.

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### Vite Configuration

The project uses Vite for bundling and development. Configuration can be modified in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  // Add custom configuration here
})
```

### ESLint Configuration

Linting rules are defined in `eslint.config.js`. The project uses:
- ESLint flat config format (v9+)
- React Hooks rules
- Vite Fast Refresh compatibility

---

## 🎮 Usage

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

---

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets
│   ├── compass-svgrepo-com.svg # Favicon
│   └── vite.svg                # Vite logo
├── src/
│   ├── assets/                 # Image assets
│   │   └── react.svg
│   ├── components/             # Reusable components
│   │   └── PrivateRoute.jsx    # Protected route wrapper
│   ├── pages/                  # Page components
│   │   ├── Login.jsx           # Login page
│   │   ├── Login.module.css    # Login styles
│   │   ├── Home.jsx            # Main dashboard
│   │   ├── Home.module.css     # Dashboard styles
│   │   ├── GeoMap.jsx          # Map component
│   │   └── GeoMap.module.css   # Map styles
│   ├── services/               # API service layer
│   │   └── api.js              # Axios API functions
│   ├── App.jsx                 # Root component with routing
│   ├── App.css                 # App-level styles
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables (not in git)
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

### Key Directories

- **`/src/pages`** - All page-level components with their CSS modules
- **`/src/components`** - Reusable components like PrivateRoute
- **`/src/services`** - API communication layer with axios
- **`/public`** - Static files served as-is

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start development server with HMR |
| **build** | `npm run build` | Build for production |
| **preview** | `npm run preview` | Preview production build locally |
| **lint** | `npm run lint` | Run ESLint on all files |

---

## 🔌 API Integration

### Authentication

**Login**
```javascript
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here"
}
```

### History Management

**Get History**
```javascript
GET /history
Authorization: Bearer <token>

Response:
[
  {
    "_id": "123",
    "ip": "8.8.8.8",
    "city": "Mountain View",
    "country": "US",
    "org": "Google LLC"
  }
]
```

**Save History**
```javascript
POST /history
Authorization: Bearer <token>
Content-Type: application/json

{
  "ip": "8.8.8.8",
  "city": "Mountain View",
  "country": "US",
  "org": "Google LLC"
  // ... other ipinfo.io fields
}
```

**Delete History**
```javascript
DELETE /history
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": ["123", "456"]
}
```

### Third-Party API

**ipinfo.io** is used for geolocation data:

```javascript
// Get user's own IP location
GET https://ipinfo.io/geo

// Get specific IP location
GET https://ipinfo.io/{IP_ADDRESS}/geo

Response:
{
  "ip": "8.8.8.8",
  "hostname": "dns.google",
  "city": "Mountain View",
  "region": "California",
  "country": "US",
  "loc": "37.4056,-122.0775",
  "org": "AS15169 Google LLC",
  "postal": "94043",
  "timezone": "America/Los_Angeles"
}
```

**Note**: ipinfo.io has rate limits on free tier. Consider upgrading for production use.

---

## 🖼️ Screenshots

### Login Page
Terminal-inspired login interface with animated background map visualization.

### Dashboard
Three-panel layout featuring:
- **Left**: IP search bar, detailed geo data panel, interactive map
- **Right**: Search history sidebar with selection controls

### Map View
Interactive Leaflet map with custom animated pins and smooth fly-to transitions.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and formatting
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**itzjmbruhhh**

- GitHub: [@itzjmbruhhh](https://github.com/itzjmbruhhh)
- Project Link: [https://github.com/itzjmbruhhh/geo-webapp](https://github.com/itzjmbruhhh/geo-webapp)

---

## 🙏 Acknowledgments

- [ipinfo.io](https://ipinfo.io/) - IP geolocation data provider
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles
- [Leaflet](https://leafletjs.com/) - Interactive map library
- [React](https://react.dev/) - UI library
- [Vite](https://vite.dev/) - Build tool

---

## 🐛 Known Issues

- IPv6 addresses are not currently supported (IPv4 only)
- Map requires internet connection for tile loading
- History selection state is not persisted on page refresh

---

## 🔮 Future Enhancements

- [ ] IPv6 support
- [ ] Bulk IP search with CSV upload
- [ ] Export history to JSON/CSV
- [ ] Dark/light theme toggle
- [ ] Mobile responsive design
- [ ] Real-time IP tracking
- [ ] Advanced filtering and search in history
- [ ] User preferences and settings
- [ ] Multi-language support

---

<div align="center">

**Built with ❤️ by itzjmbruhhh**

*© 2026 LOCATE.IO. All rights reserved.*

</div>
