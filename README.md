# Apex Admin - Forex Trading Admin Panel

A modern, responsive admin panel for forex trading management built with React, TypeScript, Vite, and ShadCN UI.

## 🎨 Design Features

- **Exact UI Clone**: Pixel-perfect implementation of the provided designs
- **Brand Colors**: 
  - Primary Green: `#18B451`
  - Light Green: `#B3E7D7`
- **Fully Responsive**: Mobile-first design with responsive breakpoints
- **Modern UI Components**: Built with ShadCN UI and Tailwind CSS

## 🚀 Features

### Authentication
- ✅ Sign In page with role selection
- ✅ Reset Password functionality
- ✅ Toast notifications instead of alerts

### Dashboard
- ✅ Real-time statistics cards
- ✅ Profit growth chart with Recharts
- ✅ Profit sharing pie chart
- ✅ Active feeds section
- ✅ Market status toggle

### Market Management
- ✅ Market list with filters
- ✅ Add/Edit market configuration
- ✅ Market rules and settings
- ✅ Opening/Closing time configuration

### User Management
- ✅ User list with role-based tabs
- ✅ User profile view
- ✅ Edit user profile
- ✅ Account settings
- ✅ Profit sharing configuration

### Balance Management
- ✅ Balance overview with statistics
- ✅ User balance details
- ✅ Add/Deduct funds modal
- ✅ Transaction history
- ✅ Exposure utilization tracking

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **ShadCN UI** - Component Library
- **Recharts** - Data Visualization
- **Lucide React** - Icons
- **React Toastify** - Notifications

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Routes

### Public Routes
- `/` - Sign In
- `/reset-password` - Reset Password

### Protected Routes (with Layout)
- `/dashboard` - Dashboard Overview
- `/market-watch` - Market Watch
- `/market-management` - Market List
- `/add-market` - Add New Market
- `/user-management` - User List
- `/user-profile/:id` - User Profile Details
- `/edit-profile/:id` - Edit User Profile
- `/balances` - Balance Overview
- `/user-balance/:id` - User Balance Details
- `/commissions` - Commissions (Placeholder)
- `/reports` - Reports (Placeholder)
- `/notifications` - Notifications (Placeholder)
- `/settings` - Settings (Placeholder)

## 📱 Mobile Responsive

The application is fully responsive with:
- Mobile menu toggle
- Responsive grid layouts
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🎯 Key Components

### UI Components (`src/components/ui/`)
- `Button` - Primary, outline, and ghost variants
- `Input` - Text inputs with focus states
- `Select` - Dropdown selections
- `Card` - Container components
- `Switch` - Toggle switches
- `Dialog` - Modal dialogs

### Layout Components
- `Layout` - Main app layout with sidebar
- Responsive sidebar navigation
- Header with search and notifications

### Pages (`src/pages/`)
All pages implement the exact designs from the provided images with proper styling and functionality.

## 🔧 Configuration Files

- `tailwind.config.js` - Tailwind configuration with custom colors
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration with path aliases

## 🎨 Color Palette

```css
--primary: #18B451 (Green)
--primary-light: #B3E7D7 (Light Green)
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
```

## 📝 Notes

- All UI screens are properly wired up with React Router
- Toast notifications are used throughout the app
- Forms include proper validation
- Charts are interactive and responsive
- All data is currently mocked (ready for API integration)

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open browser to: `http://localhost:5173`

Default test credentials (mock):
- Email: any valid email
- Role: Select any role
- Password: any password

## 📄 License

This project is for demonstration purposes.

