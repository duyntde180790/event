# Event Management System

A Node.js-based Event Management System for FPT University Da Nang that allows students to register for events and administrators to manage event registrations.

## Features

- User Authentication (JWT-based)
- Role-based Access Control (Admin/Student)
- Event Registration Management
- Real-time Registration Updates
- Search and Filter Capabilities

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event_management
JWT_SECRET=your_jwt_secret_key_here
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/auth/login` - User login

### Event Registration (Student)
- POST `/registrations` - Register for an event
- DELETE `/registrations/:registrationId` - Unregister from an event

### Event Management (Admin)
- GET `/registrations` - Get paginated list of registrations
- GET `/registrations/search` - Search registrations by date range

## Usage

### Authentication
```bash
# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "password"}'
```

### Student Operations
```bash
# Register for an event
curl -X POST http://localhost:5000/registrations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventId": "event_id"}'

# Unregister from an event
curl -X DELETE http://localhost:5000/registrations/registration_id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Admin Operations
```bash
# Get all registrations
curl -X GET http://localhost:5000/registrations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search registrations by date
curl -X GET "http://localhost:5000/registrations/search?startDate=2024-03-01&endDate=2024-03-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Project Structure

```
SDN302_event/
├── src/
│   ├── models/
│   │   ├── userModel.js
│   │   └── registrationModel.js
│   │   └── eventModel.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── registrationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── registrationRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

## Security Considerations

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- Role-based access control is implemented
- Environment variables are used for sensitive data
- Input validation is performed on all endpoints

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error 