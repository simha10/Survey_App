# Survey Management Web Portal

A comprehensive web-based management interface for the Survey Application, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### 🔐 Authentication & Authorization

- **Role-based Access Control**: SUPERADMIN, ADMIN, SUPERVISOR, SURVEYOR
- **JWT Token Management**: Secure authentication with automatic token refresh
- **Protected Routes**: Role-based route protection
- **Login Form**: Multi-role login with validation

### 📊 Dashboard

- **Role-based Dashboard**: Different views based on user role
- **Statistics Cards**: Key metrics display
- **Quick Actions**: Role-specific action shortcuts
- **Recent Activity**: Real-time activity feed

### 🏗️ Modular Architecture

- **Feature-based Structure**: Organized by business features
- **Reusable Components**: Shared UI components
- **API Client**: Centralized API communication
- **Type Safety**: Full TypeScript support

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Home page (redirects)
├── components/           # Shared UI components
│   └── layout/          # Layout components
│       ├── MainLayout.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
├── features/            # Feature-based modules
│   ├── auth/           # Authentication feature
│   │   ├── AuthContext.tsx
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── users/          # User management (to be built)
│   ├── wards/          # Ward management (to be built)
│   └── qc/             # QC management (to be built)
├── lib/                # Utility libraries
│   └── api.ts          # API client and endpoints
└── styles/             # Global styles
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + TanStack Query
- **HTTP Client**: Axios
- **Authentication**: JWT with localStorage
- **UI Components**: Custom components with Tailwind

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:4000`

### Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - You'll be redirected to login page
   - Use your backend credentials to login

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure Guidelines

1. **Feature-based Organization**: Each feature has its own directory
2. **Component Reusability**: Shared components in `/components`
3. **Type Safety**: All components and functions are typed
4. **API Integration**: Use the centralized API client in `/lib/api.ts`

### Adding New Features

1. Create feature directory in `/src/features/`
2. Add API endpoints to `/lib/api.ts`
3. Create components in feature directory
4. Add routes to sidebar navigation
5. Update role permissions as needed

## 🔐 Authentication Flow

1. **Login**: User enters credentials and role
2. **Token Storage**: JWT stored in localStorage
3. **Route Protection**: ProtectedRoute component checks authentication
4. **Role-based Access**: Sidebar shows only permitted navigation
5. **Auto Logout**: Token expiration triggers automatic logout

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Responsive Layout**: Adapts to different screen sizes
- **Touch-friendly**: Mobile-optimized interactions
- **Collapsible Sidebar**: Mobile sidebar with overlay

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation feedback
- **Accessibility**: ARIA labels and keyboard navigation

## 🔄 State Management

- **Auth Context**: Global authentication state
- **TanStack Query**: Server state management
- **Local State**: Component-level state with useState
- **Persistent Storage**: JWT tokens in localStorage

## 🚧 Next Steps

### Planned Features

- [ ] User Management Module
- [ ] Ward Management Module
- [ ] QC Management Module
- [ ] Reports & Analytics
- [ ] Real-time Notifications
- [ ] Data Export/Import
- [ ] Advanced Search & Filtering

### Technical Improvements

- [ ] Add unit tests
- [ ] Implement error boundaries
- [ ] Add loading skeletons
- [ ] Optimize bundle size
- [ ] Add PWA features

## 🤝 Contributing

1. Follow the modular architecture
2. Maintain type safety
3. Use consistent naming conventions
4. Add proper error handling
5. Test on multiple devices

## 📄 License

This project is part of the Survey Application ecosystem.

---

**Note**: This web portal is designed to work with the Node.js/Express backend API. Ensure the backend is running and accessible before using the web portal.
