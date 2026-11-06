# RideX – Real-Time Ride Booking Platform

A full-stack, real-time ride-booking application inspired by modern mobility platforms. The project provides separate experiences for riders and captains (drivers), with account authentication, ride lifecycle management, map-based location services, and live communication using Socket.IO.

> **Project status:** This repository contains the application source code. Add your own MongoDB connection string and Google Maps API keys before running it. Deployment and production hardening are not included by default.

## Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Installation and Local Setup](#installation-and-local-setup)
- [Application Workflows](#application-workflows)
- [API Overview](#api-overview)
- [Real-Time Communication](#real-time-communication)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

## Overview

The platform connects two types of users:

- **Riders:** create an account, search for pickup and destination locations, review ride details, request a ride, and follow the ride status.
- **Captains:** register with vehicle details, sign in, receive ride requests, accept or manage rides, and update their live location.

The frontend is built with React and Vite. The backend exposes REST APIs using Node.js and Express, persists application data with MongoDB/Mongoose, and uses Socket.IO for real-time events.

## Core Features

### Rider experience
- Rider registration, login, profile and logout flows
- Protected rider pages
- Pickup and destination search
- Address autocomplete and map-based location support
- Ride fare/distance/time information through map services
- Ride request and ride status screens
- Live ride tracking interface

### Captain experience
- Captain registration with vehicle information
- Captain login, profile and logout flows
- Protected captain pages
- Receive and respond to ride requests
- Accept and complete ride workflows
- Live captain location updates

### Backend and real-time capabilities
- REST API organized into user, captain, map and ride routes
- MongoDB data models for users, captains, rides and blacklisted tokens
- Password hashing with bcrypt
- JWT-based authentication
- Token blacklist support for logout
- Socket.IO connection handling and location/event updates
- Google Maps services for geocoding, distance/time and autocomplete

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router |
| Styling and animation | Tailwind CSS, GSAP, Remix Icon |
| Maps | Google Maps JavaScript API, `@react-google-maps/api` |
| HTTP communication | Axios |
| Real-time client | Socket.IO Client |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Real-time server | Socket.IO |
| Map services | Google Maps Geocoding, Distance Matrix and Places APIs |

## Application Architecture

```text
Browser
  |
  v
React + Vite frontend
  |                         \
  | REST API (Axios)         \ Socket.IO
  v                           v
Express backend <---------- Real-time events
  |
  +---- User routes/controllers/services
  |
  +---- Captain routes/controllers/services
  |
  +---- Ride routes/controllers/services
  |
  +---- Maps routes/services ---- Google Maps APIs
  |
  v
MongoDB (Mongoose models)
```

## Repository Structure

```text
RideX-Ride-Booking-Platform/
├── Backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   ├── server.js
│   ├── socket.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before starting:

- [Node.js](https://nodejs.org/) (LTS recommended) and npm
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas cluster
- A Google Cloud project with the required Maps APIs enabled and a valid API key
- Git

## Environment Configuration

Create local `.env` files from the provided templates. Do not commit real credentials.

### Backend

In `Backend/`, copy `.env.example` to `.env` and configure:

```env
PORT=3000
DB_CONNECT=mongodb://127.0.0.1:27017/uber_clone
JWT_SECRET=replace_with_a_long_random_secret
GOOGLE_MAPS_API=your_google_maps_api_key
```

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the Express/HTTP server |
| `DB_CONNECT` | MongoDB connection URI |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens |
| `GOOGLE_MAPS_API` | Server-side Google Maps API key |

### Frontend

In `frontend/`, copy `.env.example` to `.env` and configure:

```env
VITE_BASE_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

| Variable | Purpose |
|---|---|
| `VITE_BASE_URL` | Backend base URL used by frontend API calls and sockets |
| `VITE_API_URL` | Backend URL used by logout/API calls in the current source |
| `VITE_GOOGLE_MAPS_API_KEY` | Browser-side Maps key used by the map component |

**Important:** Vite variables prefixed with `VITE_` are bundled into browser code and are not secret. Restrict the browser Maps key by HTTP referrer and API. Restrict the backend key by API and server environment wherever possible.

### Google Maps APIs

Depending on the Google Cloud project and enabled features, configure the APIs used by the application, including:
- Maps JavaScript API
- Geocoding API
- Distance Matrix API
- Places API (autocomplete)

Google Cloud may require billing to be enabled. Review current Google Maps Platform requirements and pricing before using the APIs.

## Installation and Local Setup

Run the backend and frontend in separate terminals.

### 1. Clone the repository

```bash
git clone https://github.com/aman07052005/RideX-Real-Time-Ride-Booking-Platform.git
cd RideX-Real-Time-Ride-Booking-Platform
```

### 2. Start MongoDB

Start your local MongoDB service, or use a MongoDB Atlas connection string in `Backend/.env`.

### 3. Install and start the backend

```bash
cd Backend
npm install
```

Create `Backend/.env` using the environment variables described above.

The backend package currently does not define a `dev` or `start` script. Start the server directly:

```bash
node server.js
```

The default backend port is `3000` unless `PORT` is configured.

### 4. Install and start the frontend

Open another terminal from the repository root:

```bash
cd frontend
npm install
```

Create `frontend/.env` using the frontend configuration above, then run:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

### 5. Production frontend build

From the `frontend/` directory:

```bash
npm run build
npm run preview
```

The production build is generated in `frontend/dist/`.

## Application Workflows

### Rider workflow

1. Register or log in as a rider.
2. Enter pickup and destination locations.
3. Review available location and trip information.
4. Request a ride.
5. Follow ride updates and tracking in the application.
6. Complete the ride and log out when finished.

### Captain workflow

1. Register as a captain and provide vehicle details.
2. Log in to the captain experience.
3. Share location updates while connected.
4. Receive and respond to ride requests.
5. Manage the ride through acceptance and completion.

Actual ride availability and live tracking require the backend, MongoDB, Maps API configuration and both clients to be running with compatible URLs.

## API Overview

The Express application mounts these route groups:

| Base path | Purpose |
|---|---|
| `/users` | Rider registration, login, profile and logout |
| `/captains` | Captain registration, login, profile and logout |
| `/maps` | Coordinates, distance/time and location suggestions |
| `/rides` | Ride creation and ride lifecycle operations |

Common endpoint patterns documented in the backend include:

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/users/register` | Register a rider |
| `POST` | `/users/login` | Authenticate a rider |
| `GET` | `/users/profile` | Get authenticated rider profile |
| `GET` | `/users/logout` | Log out a rider |
| `POST` | `/captains/register` | Register a captain and vehicle |
| `POST` | `/captains/login` | Authenticate a captain |
| `GET` | `/captains/profile` | Get authenticated captain profile |
| `GET` | `/captains/logout` | Log out a captain |
| `GET` | `/maps/get-coordinates` | Convert an address to coordinates |
| `GET` | `/maps/get-distance-time` | Get route distance and estimated time |
| `GET` | `/maps/get-suggestions` | Get location autocomplete suggestions |

Protected endpoints require the authentication token in the format expected by the backend middleware. Check the route and middleware implementation for exact request payloads and response shapes.

For detailed request/response examples, see [`Backend/README.md`](Backend/README.md).

## Real-Time Communication

The backend initializes Socket.IO on the same HTTP server as Express. The frontend uses Socket.IO Client to connect to the backend.

The socket implementation includes events for:
- Joining a socket session with a user ID and user type
- Updating a captain's location
- Sending ride-related events to a connected socket ID
- Handling client disconnections

For production, replace permissive CORS settings with explicit trusted frontend origins and validate socket identity/authorization on the server before accepting sensitive events.

## Security Notes

- Never commit `.env` files, API keys, database credentials or JWT secrets.
- Use a long, unique JWT secret outside development.
- Restrict Google Maps keys and rotate any key that has been exposed.
- Configure explicit CORS origins for deployed environments.
- Validate and authorize every sensitive REST and socket action.
- Use HTTPS in production.
- Review upload, input validation, rate limiting and error handling before public deployment.

## Troubleshooting

**MongoDB connection fails**
- Confirm MongoDB is running.
- Check `DB_CONNECT` in `Backend/.env`.
- Verify Atlas network access and database credentials if using a hosted cluster.

**Maps requests fail**
- Check both Maps environment variables.
- Confirm the relevant Google Maps APIs are enabled.
- Verify API key restrictions and billing configuration.

**Frontend cannot reach the backend**
- Confirm the backend is running on the configured port.
- Check `VITE_BASE_URL` and `VITE_API_URL`.
- Restart Vite after changing environment variables.

**Socket connection fails**
- Confirm the frontend socket URL points to the backend.
- Check server availability and CORS configuration.
- Ensure the backend and frontend are using compatible origins.

## Future Enhancements

- Add automated unit and integration tests
- Add API documentation with OpenAPI/Swagger
- Add ride history, ratings and payment integration
- Improve matching and captain availability logic
- Add stronger socket authentication and validation
- Add production deployment guides and CI workflows
- Add monitoring, structured logging and rate limiting

## Author

**Aman Yadav**

- GitHub: [@aman07052005](https://github.com/aman07052005)

---

If you find this project useful, consider giving the repository a ⭐.
