# GreenCart Logistics - Delivery Simulation & KPI Dashboard

## 🚀 Live Deployment
- **Frontend**: https://green-cart-logistics-4z6o.vercel.app/
- **Backend API**: https://greencart-logistics-ngsg.onrender.com/
- **Demo Video**: https://www.youtube.com/watch?v=8nbVk6tX2P8
- **GitHub Repository**: https://github.com/anujkvcs/GreenCart-Logistics

## Project Overview & Purpose
GreenCart Logistics is an eco-friendly delivery company simulation tool built for Purple Merit Technologies assessment. This internal management tool helps delivery managers experiment with staffing levels, delivery schedules, and route allocations to optimize profits and operational efficiency. The application provides real-time KPI calculations based on custom proprietary business rules and enables data-driven decision making for delivery operations.

## Tech Stack Used
- **Backend**: Python Django + Django REST Framework
- **Database**: MySQL
- **Frontend**: React 18 with Hooks + Vite
- **Charts**: Recharts (2 interactive charts)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Styling**: Tailwind CSS (Responsive Design)
- **Testing**: Django Unit Tests (5+ test cases)
- **Deployment**: Backend on Render, Frontend on Vercel
- **Environment**: .env configuration with proper .gitignore

## ✅ Project Status: PRODUCTION READY
All components have been tested and optimized. The application is fully functional and ready for deployment.

## Features
- **Real-time Dashboard**: Live KPIs with interactive charts showing Total Profit, Efficiency Score, and Delivery Performance
- **Advanced Simulation Engine**: Run delivery simulations with customizable parameters (drivers, hours, start time)
- **Complete Management System**: Full CRUD operations for Drivers, Routes, and Orders with intuitive UI
- **Secure Authentication**: JWT-based login/registration with automatic token refresh
- **Smart Business Logic**: Automated profit calculations with late delivery penalties, high-value bonuses, and driver fatigue modeling
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Quick Start

### Automated Setup (Recommended)
```bash
# Run the setup script to initialize everything
setup_project.bat
```

### Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
py manage.py migrate
py manage.py load_csvs
py manage.py runserver
```

#### Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
**Local Development:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

**Live Deployment URLs:**
- **Frontend**: https://green-cart-logistics-4z6o.vercel.app/
- **Backend API**: https://greencart-logistics-ngsg.onrender.com/api
- **Database**: MySQL with CSV data pre-loaded
- **Demo Video**: https://www.youtube.com/watch?v=8nbVk6tX2P8

## Environment Variables
Required environment variables (create `.env` file in backend directory):

**Development:**
```
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=reservations
DB_HOST=localhost
DB_PORT=3306
DB_USER=admindjango
DB_PASSWORD=employee@123!
```

**Production:**
```
DJANGO_SECRET_KEY=your-production-secret-key
DEBUG=False
DB_NAME=your-mysql-database
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
```

**Note**: Actual values are excluded from repository via .gitignore for security.

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Token refresh

### Data Management
- `GET/POST/PUT/DELETE /api/drivers/` - Driver CRUD
- `GET/POST/PUT/DELETE /api/routes/` - Route CRUD  
- `GET/POST/PUT/DELETE /api/orders/` - Order CRUD

### Simulation & Analytics
- `GET /api/dashboard/` - Dashboard KPIs
- `POST /api/simulation/run/` - Run simulation
- `GET /api/simulation/history/` - Simulation history

## Custom Business Rules (Proprietary)
Implemented as per Purple Merit Technologies specifications:

1. **Late Delivery Penalty**: ₹50 penalty if delivery time > (base route time + 10 minutes)
2. **Driver Fatigue Rule**: If driver works >8 hours in a day, delivery speed decreases by 30% next day
3. **High-Value Bonus**: If order value > ₹1000 AND delivered on time → add 10% bonus to order profit
4. **Fuel Cost Calculation**: 
   - Base cost: ₹5/km per route
   - If traffic level is "High" → +₹2/km fuel surcharge
5. **Overall Profit**: Sum of (order value + bonus – penalties – fuel cost)
6. **Efficiency Score**: (On-time Deliveries / Total Deliveries) × 100

## Testing
Run backend tests:
```bash
cd backend
py manage.py test
```

Run specific test file:
```bash
py -m unittest tests.py
```

## 🎯 Getting Started (Live Demo)
1. **Visit**: https://green-cart-logistics-4z6o.vercel.app/
2. **Register**: Create a new account using the registration form
3. **Login**: Access the dashboard with your credentials
4. **Explore**: Navigate between Dashboard, Simulation, and Management sections
5. **Simulate**: Run delivery scenarios with different parameters
6. **Manage**: Add/edit drivers, routes, and orders as needed
7. **Watch Demo**: https://www.youtube.com/watch?v=8nbVk6tX2P8

## 📊 Sample Data
The application comes pre-loaded with:
- **10 Drivers** with varying shift hours and past week data
- **10 Routes** with different distances and traffic levels
- **50 Orders** with various values and delivery requirements

## Authentication & Security
- JWT-based authentication with automatic token refresh
- Secure API endpoints with Bearer token validation
- Session management with automatic logout on token expiration

## Project Structure
```
├── backend/
│   ├── api/                 # Django app
│   ├── data/               # CSV data files
│   ├── pm_backend/         # Django settings
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/          # React components
│   │   └── services/       # API services
│   └── package.json
└── README.md
```

## Deployment Instructions

### Backend Deployment (Render/Railway)
1. Create account on Render or Railway
2. Connect GitHub repository
3. Set environment variables:
   - `DJANGO_SECRET_KEY`
   - `DEBUG=False`
   - Database credentials for PostgreSQL
4. Deploy with build command: `pip install -r requirements.txt`
5. Start command: `python manage.py runserver 0.0.0.0:$PORT`

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Update API_BASE URL to production backend URL

### Cloud Database Setup
**Recommended Cloud Providers:**
- **Railway**: Free PostgreSQL with easy Django integration
- **Neon**: Free PostgreSQL with generous limits  
- **Supabase**: PostgreSQL with additional features
- **Render**: PostgreSQL with simple deployment

**Setup Steps:**
1. Create database on chosen provider
2. Get connection string/credentials
3. Add to environment variables
4. Run migrations: `python manage.py migrate`
5. Load data: `python manage.py load_csvs`

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register/
Body: {"username": "string", "password": "string"}
Response: {"message": "User created"}

POST /api/auth/login/
Body: {"username": "string", "password": "string"}
Response: {"access": "jwt_token", "refresh": "refresh_token"}
```

### Data Management Endpoints
```
GET /api/drivers/ - List all drivers
POST /api/drivers/ - Create new driver
PUT /api/drivers/{id}/ - Update driver
DELETE /api/drivers/{id}/ - Delete driver

GET /api/routes/ - List all routes
POST /api/routes/ - Create new route
PUT /api/routes/{id}/ - Update route
DELETE /api/routes/{id}/ - Delete route

GET /api/orders/ - List all orders
POST /api/orders/ - Create new order
PUT /api/orders/{id}/ - Update order
DELETE /api/orders/{id}/ - Delete order
```

### Analytics & Simulation Endpoints
```
GET /api/dashboard/
Response: {
  "total_profit": 15420.50,
  "efficiency_score": 85.2,
  "on_time_deliveries": 42,
  "late_deliveries": 8,
  "fuel_cost_breakdown": [...]
}

POST /api/simulation/run/
Body: {
  "num_drivers": 5,
  "start_time": "09:00",
  "max_hours": 8
}
Response: {
  "total_profit": 12500.75,
  "efficiency_score": 88.5,
  "on_time_deliveries": 35,
  "late_deliveries": 5,
  "total_fuel_cost": 2400.00
}

GET /api/simulation/history/
Response: [simulation_results...]
```

### Test Endpoints
```
GET /api/test/ - Database connectivity test
GET /api/simple-test/ - Basic server test
```

## Technical Highlights
- **Performance**: Optimized API calls with centralized service layer
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Data Validation**: Input validation on both frontend and backend
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Code Quality**: Clean, maintainable code structure with proper separation of concerns

## Development Environment
- Backend: Django 4.2 + DRF on http://localhost:8000
- Frontend: React 18 + Vite on http://localhost:5173
- Database: SQLite (development) / PostgreSQL (production)
- Authentication: JWT with 1-hour expiration
- CORS enabled for cross-origin requests