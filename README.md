# EventFlow — Event Management Platform

A full-stack web application for managing events end-to-end, 
built as a university project at the German International University (GIU).

---

## Team Members

| Name | 
|------|
| Youssef Gedawy | 
| Mohamed Gohar  |
| Mazen Ibrahim  |
| Omar Hammam    | 
---

## Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT |
| Dummy Data | @faker-js/faker |
| Version Control | GitHub |

---

## User Roles

| Role | Email | Password |
|------|-------|----------|
| Organizer | organizer@test.com | password123 |
| Staff | any staff email | password123 |
| Vendor | vendor@test.com | password123 |
| Guest | guest@test.com | password123 |
| Venue Owner | venueowner@test.com | password123 |

---

## Setup Instructions

### 1. Clone the repository
git clone https://github.com/YoussefGedawy/event-management-platform.git
cd event-management-platform

### 2. Backend Setup
cd backend
npm install
node server.js

Create a .env file inside backend:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=mysecretkey123

### 3. Frontend Setup
cd frontend
npm install
npm run dev

---

## Database and Dummy Data

To populate the database with dummy data, start the backend and visit:
http://localhost:5000/api/seed

This generates 1 organizer, 10 staff, 20 events, 100 guests, 50 tasks, 10 vendors, 5 venues.

---

## Implemented User Journeys

### Organizer
- Register and login
- View dashboard with live stats
- Create, edit, delete events
- Browse and filter venues
- Add and manage guests with RSVP tracking
- Create and assign tasks to staff
- Manage vendors and submit sourcing requests
- Create and deactivate staff accounts

### Staff
- Login and view assigned tasks
- Update task status

### Vendor
- Login and view sourcing requests
- Update delivery status

### Guest
- Login and view invitations
- Update RSVP status

### Venue Owner
- Login and view listed venues

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/events | Get all events |
| POST | /api/events | Create event |
| PUT | /api/events/:id | Update event |
| DELETE | /api/events/:id | Delete event |
| GET | /api/venues | Get all venues |
| POST | /api/venues | Create venue |
| GET | /api/guests | Get all guests |
| POST | /api/guests | Add guest |
| PUT | /api/guests/:id | Update guest |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| GET | /api/vendors | Get all vendors |
| POST | /api/vendors | Add vendor |
| GET | /api/vendors/requests | Get requests |
| POST | /api/vendors/requests | Submit request |
| GET | /api/users/staff | Get staff |

---

## Assumptions Made

1. Staff accounts are created by the organizer not through self-registration.
2. A seed route was added to the backend to populate the database due to network timeout issues with the standalone seed script.
3. Guest invitations are added manually by the organizer rather than through email.
4. Venue booking is a request system rather than a full calendar system.
5. Budget is tracked as a single total per event.

---

## AI Usage

This project was developed with the assistance of Claude by Anthropic. The AI chatlog is in the docs/ folder. All generated code was reviewed, tested, and adapted to fit project requirements.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Backend port (default 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT |

Never commit the .env file to GitHub.

---

## Running the Project

1. cd backend && node server.js
2. cd frontend && npm run dev
3. Open http://localhost:5173
4. Login with any test account above