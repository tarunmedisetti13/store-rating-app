# Store App

A full-stack web application for managing stores and user ratings.  
Built with **React** (frontend) and **Node.js + Express** (backend) with **PostgreSQL** database.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

### Clone the Repository
```bash
git clone <your-repo-url>
cd store-app
```

## 📁 Project Structure

```
store-app/
├── frontend/               # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md          # Frontend documentation
├── backend/               # Node.js/Express backend API
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── package.json
│   └── README.md          # Backend API documentation
├── docs/                  # Additional documentation
└── README.md             # This file
```

## 🔧 Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
```
Create `.env` file with database and JWT configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/storeapp
JWT_SECRET=your-secret-key
PORT=5000
```

Start the backend server:
```bash
npm run server
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create `.env` file with API URL:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

## 🌟 Features

### 👥 User Management
- **User Registration & Authentication** - Secure signup and login
- **Role-Based Access Control** - Admin, Store Owner, and User roles
- **Profile Management** - Update personal information and passwords

### 🏪 Store Management
- **Store Registration** - Admins can add new stores with owner accounts
- **Store Discovery** - Users can browse and search stores
- **Store Analytics** - Dashboard for store owners with performance metrics

### ⭐ Rating System
- **Store Ratings** - Users can rate stores (1-5 stars)
- **Rating Management** - Edit and view rating history
- **Analytics Dashboard** - Store owners can view customer feedback

### 🛡️ Admin Panel
- **User Management** - Create and manage user accounts
- **Store Oversight** - Monitor all stores and their performance
- **System Analytics** - Comprehensive dashboard with system statistics

## 🎯 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, manage users, stores, and other admins |
| **Store Owner** | Manage store profile, view ratings and analytics |
| **User** | Browse stores, submit ratings, manage personal profile |

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS Modules** - Component-scoped styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### DevOps & Tools
- **npm** - Package management
- **Git** - Version control
- **Environment Variables** - Configuration management

## 📚 Documentation

### Detailed Documentation
- **Frontend:** [`frontend/README.md`](./frontend/README.md)
  - Component structure and features
  - Frontend setup and development
  - UI/UX guidelines
  
- **Backend:** [`backend/README.md`](./backend/README.md)
  - Complete API documentation
  - Authentication endpoints
  - Admin, Store, and User APIs
  - Request/response examples

### API Endpoints Overview

#### Authentication
- `POST /api/auth/user/signup` - User registration
- `POST /api/auth/admin/signup` - Admin registration (first time)
- `POST /api/auth/login` - Login (all roles)

#### User Endpoints
- `GET /api/user/stores` - Browse stores
- `POST /api/user/add-rating` - Rate a store
- `GET /api/user/profile` - View profile

#### Admin Endpoints
- `POST /api/admin/add-store` - Add new store
- `GET /api/admin/dashboard` - System statistics
- `GET /api/admin/users` - Manage users

#### Store Owner Endpoints
- `GET /api/store/dashboard` - Store analytics
- `GET /api/store/user-ratings` - View store ratings
- `GET /api/store/profile` - Store profile

## 🚦 Development Workflow

### Running in Development Mode

1. **Start Backend** (Terminal 1):
```bash
cd backend
npm run server
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

3. **Access Application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

### Environment Setup

**Backend `.env`:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/storeapp
JWT_SECRET=your-jwt-secret-key
PORT=5000
NODE_ENV=development
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=Store Management System
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Production Deployment

### Backend Production
```bash
cd backend
npm run build
npm start
```

### Frontend Production
```bash
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and structure
- Write meaningful commit messages
- Test your changes before submitting
- Update documentation when necessary

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Frontend README](./frontend/README.md) for frontend-specific issues
2. Check the [Backend README](./backend/README.md) for API-related issues
3. Open an issue on GitHub with detailed information about the problem

## 🔮 Future Features

- **Email Notifications** - Notify store owners of new ratings
- **Advanced Analytics** - More detailed reporting and insights
- **Mobile App** - React Native mobile application
- **Rating Comments** - Allow users to leave detailed reviews

**Built with ❤️ by [Tarun Medisetti]**