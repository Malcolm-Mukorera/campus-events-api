# 🎓 Campus Events API

A RESTful API built with the MERN stack that allows university students and societies to create, manage, and discover campus events. Built as a portfolio project to demonstrate backend development skills including authentication, data modeling, and RESTful design.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [License](#license)

---

## About the Project

The Campus Events API powers a platform where university students can:

- Browse upcoming events on campus
- Create and manage their own events as an organiser
- RSVP to events they want to attend
- Filter events by date, category, or faculty

This project was built to demonstrate RESTful API design, JWT-based authentication, MongoDB data modeling, and clean Express.js architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcrypt |
| Input Validation | express-validator |
| API Documentation | Swagger UI (OpenAPI) |

---

## Features

- User registration and login with hashed passwords
- JWT-based protected routes
- Full CRUD for campus events
- RSVP / un-RSVP system
- Filter events by category, date range, and faculty
- Keyword search across event titles and descriptions
- Pagination on event listings
- Role-based access (only event owner can edit or delete their event)
- Input validation and descriptive error messages

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud instance)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/campus-events-api.git
cd campus-events-api
```

2. Install dependencies

```bash
npm install
```

3. Create your `.env` file in the root directory (see [Environment Variables](#environment-variables))

4. Start the development server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> Never commit your `.env` file. It is already listed in `.gitignore`.

---

## API Endpoints

### Auth Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |

### Event Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/events` | Get all events (supports filters & pagination) | No |
| POST | `/api/events` | Create a new event | Yes |
| GET | `/api/events/:id` | Get a single event by ID | No |
| PUT | `/api/events/:id` | Update an event | Yes (owner only) |
| DELETE | `/api/events/:id` | Delete an event | Yes (owner only) |
| POST | `/api/events/:id/rsvp` | Toggle RSVP for an event | Yes |

### Query Parameters (GET /api/events)

| Parameter | Type | Description |
|---|---|---|
| `category` | String | Filter by category (e.g. sports, academic, social) |
| `date` | String | Filter by date (e.g. `2025-03-15`) |
| `faculty` | String | Filter by faculty |
| `search` | String | Keyword search on title and description |
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Results per page (default: 10) |

### Example Request

```bash
GET /api/events?category=sports&page=1&limit=5
Authorization: Bearer <your_jwt_token>
```

### Example Response

```json
{
  "success": true,
  "count": 5,
  "totalPages": 3,
  "currentPage": 1,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Annual Football Tournament",
      "description": "Inter-faculty football tournament open to all students.",
      "date": "2025-04-10T14:00:00.000Z",
      "location": "University Sports Ground",
      "category": "sports",
      "faculty": "All",
      "organizer": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
        "name": "Sports Society"
      },
      "attendees": [],
      "capacity": 100,
      "createdAt": "2025-03-01T10:00:00.000Z"
    }
  ]
}
```

---

## Data Models

### User

```js
{
  name: String,           // required
  email: String,          // required, unique
  password: String,       // hashed with bcrypt
  createdAt: Date
}
```

### Event

```js
{
  title: String,          // required
  description: String,    // required
  date: Date,             // required
  location: String,       // required
  category: String,       // enum: ["academic", "social", "sports", "career", "other"]
  faculty: String,        // e.g. "Engineering", "Science", "All"
  organizer: ObjectId,    // ref: User
  attendees: [ObjectId],  // ref: User
  capacity: Number,
  createdAt: Date
}
```

---

## Project Structure

```
campus-events-api/
├── controllers/
│   ├── authController.js      # Register & login logic
│   └── eventController.js     # CRUD & RSVP logic
├── middleware/
│   └── authMiddleware.js      # JWT verification
├── models/
│   ├── User.js                # User schema
│   └── Event.js               # Event schema
├── routes/
│   ├── authRoutes.js          # /api/auth
│   └── eventRoutes.js         # /api/events
├── .env                       # Environment variables (not committed)
├── .gitignore
├── package.json
├── server.js                  # Entry point
└── README.md
```

---

## Roadmap

- [x] User authentication with JWT
- [x] Full CRUD for events
- [x] RSVP system
- [x] Filtering and pagination
- [ ] Email notifications for RSVPs
- [ ] Image upload for event banners (Cloudinary)
- [ ] Admin role for moderating events
- [ ] Rate limiting and API key support
- [ ] Swagger UI documentation at `/api/docs`

---

## Related Repositories

- [campus-events-client](https://github.com/Malcolm-Mukorera/campus-events-client) — React frontend that consumes this API

---
https://github.com/tnsema
## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

> Built by [Malcolm Mukorera](https://github.com/Malcolm-Mukorera) & [Thobile Sema](https://github.com/tnsema)· Open to opportunities 🚀
