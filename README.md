# 🏘️ Survey Application - Comprehensive Property Assessment System

[![Project Status](https://img.shields.io/badge/status-active%20development-brightgreen.svg)](https://github.com/your-org/survey-app)
[![Backend](https://img.shields.io/badge/backend-Node.js%20%7C%20Express%20%7C%20Prisma-blue.svg)](./backend/)
[![Mobile App](https://img.shields.io/badge/mobile-React%20Native%20%7C%20Expo-61dafb.svg)](./my-expo-app/)
[![Web Portal](https://img.shields.io/badge/web-Next.js%20%7C%20TypeScript-000000.svg)](./web-portal/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-336791.svg)](https://www.postgresql.org/)

> **A comprehensive digital solution for property assessment and survey management, designed to streamline data collection, quality control, and administrative oversight in urban development projects.**

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📱 Applications](#-applications)
- [🔧 Development Setup](#-development-setup)
- [📊 Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📈 Project Status](#-project-status)
- [🎯 Future Roadmap](#-future-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Project Overview

The Survey Application is a comprehensive digital platform designed to modernize property assessment and survey management processes. Built with a focus on scalability, user experience, and data integrity, the system serves multiple stakeholders including surveyors, supervisors, administrators, and quality control personnel.

### 🎯 Project Mission

> **"To digitize and streamline property assessment workflows, ensuring accurate data collection, efficient quality control, and comprehensive administrative oversight for urban development initiatives."**

### 🌟 Key Objectives

- **Digital Transformation**: Replace paper-based survey processes with efficient digital workflows
- **Data Accuracy**: Implement robust validation and quality control mechanisms
- **User Experience**: Provide intuitive interfaces for all user roles and responsibilities
- **Scalability**: Design for growth and adaptation to varying project requirements
- **Compliance**: Ensure data integrity and audit trail capabilities

---

## 🏗️ Architecture

The application follows a modern, modular architecture with clear separation of concerns:

```
Survey_App/
├── 📱 my-expo-app/          # React Native Mobile Application
├── 🌐 web-portal/           # Next.js Web Administration Portal
├── ⚙️ backend/              # Node.js/Express API Server
├── 📚 Documentation/        # Comprehensive Documentation
└── 📋 Essentials/           # Project Requirements & Specifications
```

### 🏛️ System Architecture

```mermaid
graph TB
    A[Mobile App<br/>React Native + Expo] --> B[API Gateway<br/>Express.js]
    C[Web Portal<br/>Next.js] --> B
    B --> D[Database<br/>PostgreSQL + Prisma]
    B --> E[Authentication<br/>JWT + Role-based Access]
    B --> F[File Storage<br/>Survey Attachments]

    G[Surveyors] --> A
    H[Supervisors] --> A
    I[Administrators] --> C
    J[QC Personnel] --> C
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v13 or higher)
- **Git** for version control
- **Expo CLI** for mobile development

### 🚀 Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-org/survey-app.git
   cd survey-app
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your database URL and JWT secret
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```

3. **Mobile App Setup**

   ```bash
   cd my-expo-app
   npm install
   npx expo start
   ```

4. **Web Portal Setup**
   ```bash
   cd web-portal
   npm install
   npm run dev
   ```

### 🌐 Access Points

- **Backend API**: `http://localhost:4000`
- **Web Portal**: `http://localhost:3000`
- **Mobile App**: Scan QR code with Expo Go app

---

## 📱 Applications

### 📱 Mobile Application (React Native + Expo)

**Target Users**: Surveyors, Supervisors

**Key Features**:

- 🔐 **Role-based Authentication** with secure login/logout
- 📊 **Dashboard Views** tailored to user roles
- 📝 **Survey Creation** with comprehensive property assessment
- 🏢 **Floor-wise Assessment** for residential and non-residential properties
- 📍 **Assignment Management** with ward and mohalla assignments
- 💾 **Offline Support** with data synchronization
- 🌙 **Dark/Light Mode** for enhanced user experience

**Technology Stack**:

- React Native with Expo
- TypeScript for type safety
- NativeWind for styling
- AsyncStorage for local data persistence
- Axios for API communication

### 🌐 Web Portal (Next.js)

**Target Users**: Administrators, QC Personnel, Supervisors

**Key Features**:

- 👥 **User Management** with role assignment and status control
- 🗺️ **Assignment Management** with bulk operations and conflict detection
- 📊 **Survey Review** and quality control workflows
- 📈 **Analytics Dashboard** with comprehensive reporting
- 🔍 **Advanced Filtering** and search capabilities
- 📋 **Master Data Management** for ULBs, zones, wards, and mohallas

**Technology Stack**:

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form for form management
- Server-side rendering for performance

### ⚙️ Backend API (Node.js + Express)

**Core Services**:

- 🔐 **Authentication & Authorization** with JWT tokens
- 📊 **Survey Management** with comprehensive data models
- 👥 **User Management** with role-based access control
- 🗺️ **Assignment System** with conflict detection
- 📋 **Master Data APIs** for all reference data
- 🔍 **Quality Control** workflows and approval processes

**Technology Stack**:

- Node.js with Express.js
- TypeScript for type safety
- Prisma ORM with PostgreSQL
- Zod for data validation
- JWT for authentication
- CORS for cross-origin requests

---

## 🔧 Development Setup

### Environment Configuration

#### Backend Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/survey_app"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
NODE_ENV="development"
```

#### Mobile App Environment Variables

```env
EXPO_PUBLIC_API_BASE_URL="http://192.168.18.210:4000/api"
```

### Database Setup

1. **Create PostgreSQL Database**

   ```sql
   CREATE DATABASE survey_app;
   ```

2. **Run Migrations**

   ```bash
   cd backend
   npx prisma migrate dev
   ```

3. **Seed Database**
   ```bash
   npx prisma db seed
   ```

### Development Workflow

1. **Start Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Mobile App**

   ```bash
   cd my-expo-app
   npx expo start
   ```

3. **Start Web Portal**
   ```bash
   cd web-portal
   npm run dev
   ```

---

## 📊 Features

### 🔐 Authentication & Authorization

- **Multi-role Support**: SUPERADMIN, ADMIN, SUPERVISOR, SURVEYOR
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** with granular permissions
- **Session Management** with automatic token refresh

### 📝 Survey Management

- **Comprehensive Property Assessment** with detailed data collection
- **Floor-wise Assessment** for multi-story properties
- **Residential & Non-residential** property type support
- **File Attachment Support** for property documentation
- **Property Image Management** with upload and retrieval APIs
- **Offline Data Collection** with synchronization capabilities

### 🗺️ Assignment Management

- **Ward & Mohalla Assignments** with bulk operations
- **Conflict Detection** and resolution mechanisms
- **Assignment Tracking** with status monitoring
- **Cross-ULB Assignment** support for large-scale projects

### 📊 Quality Control

- **Multi-level QC Review** with approval workflows
- **Bulk QC Operations** for efficient processing
- **Audit Trail** with comprehensive history tracking
- **Error Detection** and correction mechanisms

### 📈 Reporting & Analytics

- **Survey Completion Analytics** with progress tracking
- **Assignment Performance Metrics** for user evaluation
- **Quality Control Reports** with detailed insights
- **Export Capabilities** for external analysis

---

## 🛠️ Technology Stack

### Backend Technologies

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schema validation
- **API**: RESTful API design

### Mobile Application

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: React Context API
- **Storage**: AsyncStorage + SecureStore

### Web Portal

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **UI Components**: Custom components with Tailwind
- **Authentication**: JWT with role-based access

### Database & Infrastructure

- **Database**: PostgreSQL 13+
- **ORM**: Prisma with type-safe queries
- **Migrations**: Prisma migrations
- **Seeding**: Custom seed scripts
- **Indexing**: Optimized database indexes

---

## 📈 Project Status

### ✅ Completed Features

- **Core Infrastructure**: Backend API, mobile app, web portal
- **Authentication System**: JWT-based auth with role management
- **Survey Management**: Complete survey creation and management
- **Assignment System**: Ward/mohalla assignment with conflict detection
- **User Management**: Complete CRUD operations with role assignment
- **Master Data Management**: ULBs, zones, wards, mohallas
- **Floor-wise Assessment**: Residential and non-residential property details
- **Network Configuration**: Dynamic API connectivity and CORS setup

### 🔄 In Progress

- **QC Workflow**: Multi-level quality control implementation
- **Survey Management Interface**: Advanced survey review and editing
- **Reporting Dashboard**: Analytics and reporting features
- **Performance Optimization**: Database and API optimization

### 📋 Planned Features

- **Advanced Analytics**: Complex reporting and data visualization
- **Real-time Features**: WebSocket support for live updates
- **Push Notifications**: Mobile notifications for assignments
- **File Upload System**: Survey attachments and image management
- **Automated Testing**: Comprehensive test suite
- **Production Deployment**: CI/CD pipeline and monitoring

---

## 🎯 Future Roadmap

### 🚀 Phase 1: Core Completion (Q1 2025)

- Complete QC workflow implementation
- Advanced survey management features
- Comprehensive reporting dashboard
- Performance optimization

### 📈 Phase 2: Enhancement (Q2 2025)

- Real-time collaboration features
- Advanced analytics and insights
- Mobile app performance improvements
- Automated testing implementation

### 🌟 Phase 3: Scale & Optimize (Q3 2025)

- Production deployment
- Monitoring and logging
- Security audit and hardening
- Documentation completion

### 🔮 Phase 4: Future Innovations (Q4 2025+)

- AI-powered data validation
- Advanced reporting and BI
- Integration with external systems
- Mobile app store deployment

---

## 🤝 Contributing

We welcome contributions from developers, designers, and domain experts. Here's how you can get involved:

### 🛠️ Development Contributions

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### 📋 Contribution Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for API changes
- Follow the existing code style and patterns
- Ensure all tests pass before submitting PR

### 🐛 Bug Reports

- Use GitHub Issues for bug reports
- Include detailed reproduction steps
- Provide environment information
- Attach relevant logs and screenshots

### 💡 Feature Requests

- Use GitHub Discussions for feature ideas
- Provide detailed use cases and requirements
- Consider implementation complexity
- Discuss with maintainers before development

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 📞 Support & Contact

- **Project Maintainer**: [Your Name](mailto:your.email@example.com)
- **Technical Lead**: [Technical Lead](mailto:tech.lead@example.com)
- **Documentation**: [Documentation Team](mailto:docs@example.com)

### 🔗 Useful Links

- **Backend Documentation**: [./Documentation/BACKEND_DOCUMENTATION.md](./Documentation/BACKEND_DOCUMENTATION.md)
- **Project Status**: [./Documentation/PROJECT_STATUS.md](./Documentation/PROJECT_STATUS.md)
- **API Documentation**: [Backend API Docs](./backend/README.md)
- **Mobile App Guide**: [Mobile App Setup](./my-expo-app/README.md)
- **Web Portal Guide**: [Web Portal Setup](./web-portal/README.md)

---

## 🏆 Acknowledgments

Special thanks to all contributors, stakeholders, and the development team for their dedication to creating a comprehensive and user-friendly survey management system.

---

<div align="center">

**Built with ❤️ for efficient property assessment and survey management**

[![GitHub stars](https://img.shields.io/github/stars/your-org/survey-app.svg?style=social&label=Star)](https://github.com/your-org/survey-app)
[![GitHub forks](https://img.shields.io/github/forks/your-org/survey-app.svg?style=social&label=Fork)](https://github.com/your-org/survey-app/fork)

</div>
