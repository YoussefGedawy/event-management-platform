# EventFlow — Event Management Platform

A full-stack web application for managing events end-to-end, 
built as a university project at the German International University (GIU).

> **For the grader:** see "Prerequisites" and "Setup Instructions" below.
> Total setup time is ~5 minutes once Node.js is installed.

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

All test accounts use the password: `password123`

| Role | Email |
|------|-------|
| Organizer | organizer@test.com |
| Staff | staff@test.com |
| Vendor | vendor@test.com |
| Guest | guest@test.com |
| Venue Owner | venueowner@test.com |

---

## Prerequisites

Before running the project, the following must be installed:

| Tool | Where to get it | How to verify |
|------|-----------------|---------------|
| Node.js (LTS, v18+) | https://nodejs.org | Run `node -v` and `npm -v` in a terminal — both should print a version number |
| Git | https://git-scm.com | Run `git --version` |

A MongoDB connection string is also required. The team has provided one in the
`backend/.env` file submitted with the project (see "Environment Variables" below).
If that file is missing, contact the team or create a free cluster at
https://www.mongodb.com/cloud/atlas.

---
---

## Windows PowerShell Note

If running `npm -v` or `npm install` in PowerShell shows the error
*"npm.ps1 cannot be loaded because running scripts is disabled on this system"*,
PowerShell's default security policy is blocking npm. Fix it once with these steps:

1. Open PowerShell **as Administrator** (Start → right-click "Windows PowerShell" → Run as administrator).
2. Run:Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
3. Confirm with `Y` and press Enter.
4. Close PowerShell and reopen VS Code.

Alternatively, switch VS Code's terminal to Command Prompt instead of PowerShell:
`Ctrl+Shift+P` → "Terminal: Select Default Profile" → choose "Command Prompt".

---

## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/YoussefGedawy/event-management-platform.git
cd event-management-platform
```

(Or download and extract the submitted zip, then `cd` into the extracted folder.)

### 2. Create `backend/.env`

Inside the `backend/` folder, create a file named `.env` with these three lines:

```
PORT=5000
MONGO_URI=<the connection string provided by the team>
JWT_SECRET=mysecretkey123
```

If a `.env` file was already included with the submission, skip this step.

### 3. Start the backend

Open a terminal:

```
cd backend
npm install
node server.js
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

Leave this terminal running.

### 4. Populate the database with dummy data

Open a browser and visit:

```
http://localhost:5000/api/seed
```

You should see `✅ Seed completed! Database populated with dummy data.`
This can be visited again at any time to reset the database.

### 5. Start the frontend

Open a **second** terminal (leave the backend running):

```
cd frontend
npm install
npm run dev
```

You should see a local URL like `http://localhost:5173`.

### 6. Open the app

Visit `http://localhost:5173` in your browser and log in with any of the
test accounts in the "User Roles" table above (password: `password123`).

---

## Database and Dummy Data

The `/api/seed` route (step 4 above) resets all collections and generates:
1 organizer, 1 venue owner, 20 staff, 15 vendors, 10 venues, 20 events,
100 guests, 50 tasks, and 20 vendor requests. The route can be visited
again at any time to reset and re-seed the database.

(Optional) A standalone script also exists at `database/seed.js`. To use it:
`cd database && npm install`, make sure `backend/.env` contains a valid `MONGO_URI`,
then run `node seed.js`. The `/api/seed` route above is the recommended path.

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

## Not Implemented / Out of Scope

The User Journeys document describes a broad system. To deliver a working,
well-tested core within the project timeline, the following lower-priority
journeys were intentionally left out of scope:

- Venue booking application flow (organizer applies to a venue; venue owner
  approves/declines). The Venue Owner dashboard is currently read-only.
- Vendor invoicing and the organizer's invoice review.
- Post-event guest feedback and feedback-based dashboard metrics.
- Report generation and PDF export.
- Day-of live messaging between organizer and guests.
- Drag-and-drop venue floor-plan designer.

The implemented features cover the core flows for all five roles
(authentication, dashboards, event/venue/guest/task/vendor management,
RSVPs, and sourcing requests).

---

## AI Usage

This project was developed with the assistance of Claude by Anthropic.
The AI chatlog is in the `docs/` folder. All generated code was reviewed,
tested, and adapted to fit project requirements.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Backend port (default 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT |

