# Parking System

A modern web-based parking management system built with React and Node.js, featuring real-time parking spot tracking, user authentication, and payment integration.

## Features

- 🔐 User Authentication (Login/Register)
- 🚗 Real-time Parking Spot Management
- 💳 Payment Integration with Razorpay
- 📊 Dashboard with Analytics
- 📱 Responsive Design
- 🔄 Real-time Updates

## Tech Stack

### Frontend
- React 19
- Vite
- TailwindCSS
- Framer Motion
- Recharts
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Razorpay Payment Gateway
- Express Validator

## Project Structure

```
parking-system/
├── client/                 # Frontend React application
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
│
└── backend/               # Backend Node.js application
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── middleware/       # Custom middleware
    ├── models/          # Database models
    ├── routes/          # API routes
    ├── utils/           # Utility functions
    └── package.json     # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd parking-system
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm run dev
```

2. Start the Frontend Development Server
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Documentation

The backend provides RESTful APIs for:
- User authentication
- Parking spot management
- Payment processing
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 